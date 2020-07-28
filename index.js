const Discord = require('discord.js');
const fs = require('fs');
const { Config } = require('./config-handler');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// Load and register commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    /* eslint-disable-next-line global-require, import/no-dynamic-require */
    const command = require(`./commands/${file}`);
    if (command.disabled || (Array.isArray(Config.blacklistCommands) && Config.blacklistCommands.includes(command.name))) {
        continue;
    }

    client.commands.set(command.name, command);
    client.cooldowns.set(command.name, new Discord.Collection());
    if (Array.isArray(Config.hiddenCommands) && Config.hiddenCommands.includes(command.name)) {
        command.hidden = true;
    }
}


// Helpers for the sanitize feature
const sanitizeMap = new Map([['[', 'p'], [']', 'P'], ['\\', '\''], ['|', '"']]);
const sanitize = function sanitize(msg) {
    let sanitized = msg;
    sanitizeMap.forEach((to, from) => {
        const replacer = new RegExp(`\\${from}`, 'g');
        sanitized = sanitized.replace(replacer, to);
    });
    return sanitized;
};


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
    // With sudo, always work regardless of mode
    if (message.content.startsWith('sudo ')) {
        message.content = message.content.slice(5);
    } else {
        const inDevGuild = message.guild && message.guild.id === Config.devModeGuildID;

        // In development mode only work in the test server; Otherwise work everywhere but the test server
        if ((process.env.NODE_ENV === 'development') === !inDevGuild) {
            return;
        }
    }

    // Ignore messages from bots (including ourselves), and blacklisted users
    if (message.author.bot || Config.blacklistUsers.includes(message.author.id)) {
        return;
    }

    // Handle AutoP messages
    const sanitized = sanitize(message.content);
    if (Config.autoP && Array.isArray(Config.autoPUsers) && Config.autoPUsers.includes(message.author.id) && message.content !== sanitized) {
        message.channel.send(`You said: ${sanitize(message.cleanContent)}`);
    }

    // Handle Jetlag Mode messages
    if (Config.jetlagMode && Config.jetlagUsers && Config.jetlagUsers[message.author.id]) {
        const delay = Config.jetlagUsers[message.author.id] % 24;
        setTimeout(() => {
            if (Config.jetlagMode && Config.jetlagUsers && Config.jetlagUsers[message.author.id]) {
                message.channel.send(`*${message.author.username} said ${delay}hrs ago:*\n${sanitized}`);
            }
        }, delay * 60 * 60 * 1000);
    }

    // Ignore messages not starting with the command prefix
    if (!message.content.startsWith(Config.prefix)) {
        return;
    }


    // Parse command arguments
    const args = sanitized.slice(Config.prefix.length).split(/\s+/g);
    const commandName = args.shift().toLowerCase();

    // Fetch the command
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
    if (!command) {
        if (commandName !== '') {
            message.reply(`I don't know what to do with you. Try \`${Config.prefix}help\` to see what I can do.`);
        }
        return;
    }

    // Handle command option 'guildOnly'
    if (command.guildOnly && !['text', 'voice', 'category'].includes(message.channel.type)) {
        message.react('❌');
        message.reply('I can only do this inside servers.');
        return;
    }

    // Handle command option 'dmOnly'
    if (command.dmOnly && !['dm', 'group'].includes(message.channel.type)) {
        message.react('❌');
        message.reply('I can only do this inside DMs.');
        return;
    }

    // Handle command option 'permissions' (only applies to guild commands)
    if (command.permissions && (!['text', 'voice', 'category'].includes(message.channel.type) || !message.member.hasPermission(command.permission))) {
        message.react('❌');
        message.reply('You\'re not the boss of me! (You\'re not allowed to use this command.)');
        return;
    }

    // Handle command option 'args'
    if (command.args && !args.length) {
        const reply = ['you need to give me some more details on this one.'];

        if (command.usage && !command.hidden) {
            reply.push(`**Usage:** \`${Config.prefix}${command.name} ${command.usage}\``);
        }

        message.react('❌');
        message.reply(reply.join('\n'));
        return;
    }

    // Handle command option 'cooldown'
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || Config.defaultCommandCooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = expirationTime - now;
            const reply = `I'm not allowed to spam, try using the \`${command.name}\` command again in ${(timeLeft / 1000).toFixed(1)} more second(s).`;
            message.react('❌');
            message.reply(reply).then((msg) => {
                msg.delete({ timeout: timeLeft });
            });
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => {
        timestamps.delete(message.author.id);
    }, cooldownAmount);

    // Execute the command
    try {
        command.execute(message, commandName, ...args);
    } catch (error) {
        console.error(error);
        message.reply('I tried, but couldn\'t execute that command for you!');
    }

    console.log(`Handled command (${commandName}): "${message.content}"`);
});

process.on('unhandledRejection', e => console.error('Unhandled promise rejection:', (new Date()).toString(), e));
client.on('error', e => console.error('Received an unexpected error', (new Date()).toString(), e));
client.on('warn', e => console.warn('Received an unexpected warning', (new Date()).toString(), e));
if (process.env.NODE_ENV === 'development') {
    client.on('debug', error => console.info(error));
}

client.login(Config.token);
