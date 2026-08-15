# Pixi Bot 🦆 (Java / Geyser Compatible)

A Minecraft Java Edition bot (Mineflayer) supporting cracked/offline mode connections.

## Deploy to Render

1. Push all files to your GitHub repository.
2. In [Render](https://render.com), create a new **Web Service** and connect the repository.
3. Render reads `render.yaml` automatically (`npm install` build, `npm start` start).
4. Configure environment variables (`MC_HOST`, `MC_PORT`, `MC_USERNAME`) in Render as needed.

## In-Game Custom Yellow Duck Skin Setup

Since the server is running in offline/cracked mode with **SkinsRestorer**, set Pixi's skin directly in-game by running:
`/skin url <link_to_yellow_duck_hoodie_png>` or `/skin <player_with_duck_skin>`
