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
        bot.chat('wait until i finish collecting plz! (or use the stop command to make it stop recollecting)');
        return;
      }

      if (commandArgs.length <= 2) {
        bot.chat('what kind of block do you want me to collect?');
        return;
      }

      const blockType = commandArgs[2];
      var blockTypeWords = '';

      if (blockType.toLowerCase() === "air") {
        bot.chat('why do you want to collect air? you can breathe air, lol');
        return;
      }

      if (blockType.toLowerCase() === "water") {
        bot.chat('i don\'t know how to collect water, sorry!');
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
        bot.chat('huh? idk that object bro...');
        return;
      }

      bot.chat(`${username} TOLD ME TO COLLECT ${formattedBlockType.toUpperCase()} YAYY!!! :D`);
      recolecting = true;
      startRecolecting(blockTypeToSearch);
      break;
    case 'here':
      bot.chat(`i\'m approaching ${username}!!!`);
      goTowardsPlayer(username);
      bot.chat(`i reached ${username}!!!`);
      // TODO: Create 'here' command
      break;
    case 'stop':
      if (recolecting) {
        recolecting = false;
        bot.chat(`${username} told me to stop collecting blocks!`);
      } else {
        bot.chat('i already stopped collecting blocks')
      }
      break;
    default:
      // Random funny feature i added
      bot.chat(`is it me or did i hear ${username} mentioning me???...`);
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
        bot.chat('wait... i can\'t find that block nearby');
        recolecting = false;
      }
    }
  }
  catch (e) {
    // TODO: Fix npm memory error that happens ocasionally
    bot.chat("i received brain damage... x_x");
    console.log(e);
  }
}

async function goTowardsPlayer(player) {
  return;
}