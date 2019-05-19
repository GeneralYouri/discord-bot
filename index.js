const fs = require('fs');
const Discord = require('discord.js');
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
    // Only work in a specific test server in development mode
    if (process.env.NODE_ENV === 'development' && (!message.guild || message.guild.id !== Config.devModeGuildID)) {
        return;
    }

    if (process.env.NODE_ENV !== 'development' && message.guild && message.guild.id === Config.devModeGuildID) {
        if (message.content.startsWith('sudo ')) {
            message.content = message.content.slice(5);
        } else {
            return;
        }
    }

    // Ignore messages from bots (including ourselves)
    if (message.author.bot) {
        return;
    }

    // Ignore messages from blacklisted users
    if (Config.blacklistUsers.includes(message.author.username)) {
        return;
    }

    // Handle AutoP messages
    const sanitized = sanitize(message.content);
    if (Config.autoP && Array.isArray(Config.autoPusers) && Config.autoPusers.includes(message.author.username) && message.content !== sanitized) {
        message.channel.send(`${message.author} said: ${sanitized}`);
    }

    // Handle Jetlag Mode messages
    if (Config.jetlagMode && message.author.username === 'MHBudak') {
        setTimeout(() => {
            if (Config.jetlagMode) {
                message.channel.send(`${message.author} said 7hrs ago: ${sanitized}`);
            }
        }, 7 * 60 * 60 * 1000);
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
        message.reply(`I don't know what to do with you. Try \`${Config.prefix}help\` to see what I can do.`);
        return;
    }

    // Handle command option 'permissions'
    if (command.permissions && !message.member.hasPermission(command.permission)) {
        message.reply('You\'re not the boss of me! (You\'re not allowed to use this command.)');
        return;
    }

    // Handle command option 'guildOnly'
    if (command.guildOnly && !['text', 'voice', 'category'].includes(message.channel.type)) {
        message.reply('I can only do this inside servers.');
        return;
    }

    // Handle command option 'dmOnly'
    if (command.dmOnly && !['dm', 'group'].includes(message.channel.type)) {
        message.reply('I can only do this inside DMs.');
        return;
    }

    // Handle command option 'args'
    if (command.args && !args.length) {
        const reply = ['you need to give me some more details on this one.'];

        if (command.usage && !command.hidden) {
            reply.push(`**Usage:** \`${Config.prefix}${command.name} ${command.usage}\``);
        }

        message.reply(reply.join('\n'));
        return;
    }

    // Handle command option 'cooldown'
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownMs = (command.cooldown || Config.defaultCommandCooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownMs;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            message.reply(`I'm not allowed to spam, try using the \`${command.name}\` command again in ${timeLeft.toFixed(1)} more second(s).`);
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownMs);

    // Execute the command
    try {
        command.execute(message, commandName, ...args);
    } catch (error) {
        console.error(error);
        message.reply('I tried, but couldn\'t execute that command for you!');
    }

    console.log(`Handled command (${commandName}): "${message.content}"`);
});

client.on('error', e => console.error('Received an unexpected error', (new Date()).toString(), e));
client.on('warn', e => console.warn('Received an unexpected warning', (new Date()).toString(), e));
if (process.env.NODE_ENV === 'development') {
    client.on('debug', error => console.info(error));
}

client.login(Config.token);
