const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const collectBlock = require('mineflayer-collectblock').plugin;

const bot = mineflayer.createBot({
  host: 'localhost', // minecraft server ip
  username: 'SillyBot', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  // auth: 'offline', // for offline mode servers, you can set this to 'offline'
  // port: 12345, // Use the port of your LAN world
  // version: '1.21' // Specify your version here
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
});

var recolecting = false;

bot.loadPlugin(pathfinder);
bot.loadPlugin(collectBlock);

bot.on('spawn', () => {
  // TODO: Program spawn behavior
})

bot.on('chat', (username, command) => {
  // Checks if the message was sent by the bot itself
  if (username === bot.username) return;

  const commandArgs = command.toString().split(' ');
  if (commandArgs[0] !== 'sillybot' || commandArgs.length <= 1) return;

  switch (commandArgs[1]) {
    case 'collect':
      // First discard all invalid commands
      if (recolecting) {
        bot.chat('Wait until i finish recollecting! (or use the stop command to make it stop recollecting)');
        return;
      }

      if (commandArgs.length <= 2) {
        bot.chat('What kind of block do you want me to collect?');
        return;
      }

      const blockType = commandArgs[2];
      var blockTypeWords = '';

      if (blockType.toLowerCase() === "air") {
        bot.chat('I can\'t collect air my friend, that\'s impossible');
        return;
      }

      if (blockType.toLowerCase() === "water") {
        bot.chat('I\'m not able to collect water, try with other block');
        return;
      }

      // Formats the text if it has spaces instead of underscores
      if (!blockType.includes('_')) {
        for (var i = 2; i < commandArgs.length; i++) {
          // Adds underscores until it gets to the last element
          blockTypeWords += commandArgs[i] += (i < commandArgs.length - 1 ? '_' : '');
        }
      }

      const blockTypeToSearch = blockType.includes('_') ? blockType : blockTypeWords;
      const formattedBlockType = blockTypeToSearch.replaceAll('_', ' ');

      if (bot.registry.blocksByName[blockTypeToSearch] === undefined) {
        bot.chat('That block is not on the list, my friend!');
        return;
      }

      bot.chat(`Beep-beep, following the order to collect ${formattedBlockType.toUpperCase()} made by ${username}...`);
      recolecting = true;
      startRecolecting(blockTypeToSearch);
      break;
    case 'here':
      bot.chat(`Approaching ${username} stealthily...`);
      goTowardsPlayer(username);
      bot.chat(`I reached you, ${username}!`);
      // TODO: Create 'here' command
      break;
    case 'stop':
      if (recolecting) {
        recolecting = false;
        bot.chat(`${username} ordered to stop collecting blocks!`);
      } else {
        bot.chat('I already stopped collecting blocks');
      }
      break;
    default:
      // Random funny feature i added
      bot.chat(`Beep-beep, waiting for an order to be received...`);
  }
})

function blockLocation(blockType) {
  return bot.findBlock({
    point: bot.entity.position,
    maxDistance: 6,
    matching: (block) => {
      return block &&
        block.type === bot.registry.blocksByName[blockType].id;
    }
  });
}

async function startRecolecting(blockType) {
  try {
    while (recolecting) {
      const block = blockLocation(blockType);
      if (block) {
        await bot.collectBlock.collect(block);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        bot.chat('Could not find that block nearby');
        recolecting = false;
      }
    }
  }
  catch (e) {
    // TODO: Fix npm memory error that happens ocasionally
    bot.chat("SillyBot has stopped working");
    console.log(e);
  }
}

async function goTowardsPlayer(player) {
  return;
}