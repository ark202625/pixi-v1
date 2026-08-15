const http = require('http');
const mineflayer = require('mineflayer');

// 1. Keep-alive server for Render free tier
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Pixi Bot is active!\n');
}).listen(port, () => {
  console.log(`Keep-alive server running on port ${port}`);
});

// 2. Bot configuration using Environment Variables with fallbacks
const botOptions = {
  host: process.env.MC_HOST || 'bottest-2inx.aternos.me',
  port: parseInt(process.env.MC_PORT) || 12736,
  username: process.env.MC_USERNAME || 'pixi',
  version: process.env.MC_VERSION || false // Auto-detect version if not set
};

function createPixiBot() {
  console.log(`Connecting to ${botOptions.host}:${botOptions.port} as ${botOptions.username}...`);
  const bot = mineflayer.createBot(botOptions);

  // When Pixi successfully joins the server
  bot.on('login', () => {
    console.log(`[Pixi] Successfully logged into ${botOptions.host}!`);
  });

  // Automatically apply skin on spawn if configured for SkinsRestorer
  bot.on('spawn', () => {
    console.log('[Pixi] Spawned in world.');
  });

  // Chat listener for in-game commands
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    // Command: !ping
    if (message === '!ping') {
      bot.chat(`Pong! Pixi is online and responsive.`);
    }

    // Command: !skin (for SkinsRestorer on cracked servers)
    if (message.startsWith('!skin ')) {
      const skinName = message.split(' ')[1];
      if (skinName) {
        bot.chat(`/skin ${skinName}`);
        bot.chat(`Attempting to set skin to: ${skinName}`);
      }
    }
  });

  // Handle errors and automatic reconnection
  bot.on('kicked', (reason) => console.log('[Pixi Kicked]:', reason));
  bot.on('error', (err) => console.log('[Pixi Error]:', err));

  bot.on('end', () => {
    console.log('[Pixi] Disconnected. Reconnecting in 10 seconds...');
    setTimeout(createPixiBot, 10000);
  });
}

// Start Pixi
createPixiBot();
