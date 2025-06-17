## Konata Minecraft assistant with Mineflayer

Have you ever wanted to see Izumi Konata from Lucky Star helping you in your Minecraft world? Well, you're 'lucky' because this project can make that idea become true!

It all started as a joke, but soon i will make this bot completely customizable (custom skins, custom name, custom behaviour, etc.)

This project is open to pull requests, feel free to test it on your LAN Minecraft worlds!

> ⚠️ **Warning:** The project is still in development so it may contain errors.

## ℹ️ Prerequisites

- Node installed
- Minecraft version 1.21 installed

## 🔧 Usage

- Open one of your worlds to LAN
- Change the port in the index.js to the port of your LAN world
- Go to the project folder in cmd and type the following command: `node index.js`
- Done! Your bot will appear on your world

## 💻 Commands

- `konata collect sample_block:` The bot will start recolecting the block in the third parameter (in this case, it will try to recollect "sample_block" but it could be dirt or oak logs for example)
- `konata stop:` The bot will stop recollecting

## ✅ To-Do List

- [ ] Fix "Out of memory" error when "collect block" is executed (happens randomly)
- [ ] Create a "followme" command
- [ ] Make the bot drop the stack of blocks to the player that ordered the block collection
- [ ] Add customizable feature

---
