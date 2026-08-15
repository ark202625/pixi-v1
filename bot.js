const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');

const HOST = process.env.MC_HOST || 'piximc.aternos.me';
const PORT = parseInt(process.env.MC_PORT || '25565');
const USERNAME = process.env.MC_USERNAME || 'pixi';

const COMMANDS_FILE = path.join(__dirname, 'commands.json');

let tempShortcuts = {};
let permShortcuts = {};

function loadPermShortcuts() {
  try {
    if (fs.existsSync(COMMANDS_FILE)) {
      permShortcuts = JSON.parse(fs.readFileSync(COMMANDS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to load permanent shortcuts:', e);
  }
}

function savePermShortcuts() {
  try {
    fs.writeFileSync(COMMANDS_FILE, JSON.stringify(permShortcuts, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save permanent shortcuts:', e);
  }
}

loadPermShortcuts();

let bot;
let currentInterval = null;

function stopCurrentAction() {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }
}

function createBot() {
  console.log(`Connecting to ${HOST}:${PORT} as ${USERNAME} (Offline Mode)...`);

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    auth: 'offline'
  });

  bot.on('chat', (username, message) => {
    if (!message || typeof message !== 'string') return;

    if (message.startsWith('*all 0') || message.startsWith('*pixi 0')) {
      stopCurrentAction();
      bot.chat('Stopped all tasks.');
      return;
    }

    if (!message.startsWith('*pixi')) return;

    let args = message.trim().split(' ');
    let cmd = args[1];

    if (!cmd) return;

    if (tempShortcuts[cmd]) {
      cmd = tempShortcuts[cmd];
    } else if (permShortcuts[cmd]) {
      cmd = permShortcuts[cmd];
    }

    handleCommand(cmd, args.slice(2));
  });

  bot.on('kicked', console.log);
  bot.on('error', console.error);

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10 seconds...');
    stopCurrentAction();
    setTimeout(createBot, 10000);
  });
}

function handleCommand(cmd, extraArgs) {
  if (cmd === 'guide1') {
    bot.chat('Actions: afk!11, kill<name>!11, mine!11');
  } else if (cmd === 'guide2') {
    bot.chat('Items: dropitem!01, dropinv!01, equiparmor!01, droparmor!01');
  } else if (cmd === 'guide3') {
    bot.chat('Shortcuts: perm <name> <cmd>, temp <name> <cmd>, del <name>, list');
  } else if (cmd === 'dropitem!01') {
    const item = bot.heldItem;
    if (item) {
      bot.tossStack(item);
      bot.chat('Dropped held item.');
    } else {
      bot.chat('Not holding any item.');
    }
  } else if (cmd === 'dropinv!01') {
    bot.inventory.items().forEach((item) => bot.tossStack(item));
    bot.chat('Dropped inventory contents.');
  } else if (cmd.startsWith('perm')) {
    const name = extraArgs[0];
    const target = extraArgs.slice(1).join(' ');
    if (name && target) {
      permShortcuts[name] = target;
      savePermShortcuts();
      bot.chat(`Saved permanent shortcut: ${name} -> ${target}`);
    }
  } else if (cmd.startsWith('temp')) {
    const name = extraArgs[0];
    const target = extraArgs.slice(1).join(' ');
    if (name && target) {
      tempShortcuts[name] = target;
      bot.chat(`Saved temp shortcut: ${name} -> ${target}`);
    }
  } else if (cmd === 'list') {
    const permKeys = Object.keys(permShortcuts).join(', ') || 'None';
    const tempKeys = Object.keys(tempShortcuts).join(', ') || 'None';
    bot.chat(`Perm: [${permKeys}] | Temp: [${tempKeys}]`);
  } else if (cmd.startsWith('del')) {
    const name = extraArgs[0];
    delete permShortcuts[name];
    delete tempShortcuts[name];
    savePermShortcuts();
    bot.chat(`Deleted shortcut: ${name}`);
  }
}

createBot();
