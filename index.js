const fs = require('fs');
const Discord = require('discord.js');
const { Config } = require('./config-handler');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// Load and register commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    if (!Config.blacklistCommands.includes(command.name)) {
        client.commands.set(command.name, command);
        client.cooldowns.set(command.name, new Discord.Collection());
        if (Config.hiddenCommands.includes(command.name)) {
            command.hidden = true;
        }
    }
}


// Helpers for the sanitize feature
const sanitizeMap = new Map([['[', 'p'], [']', 'P']]);
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

    // Ignore messages from bots (including ourselves)
    if (message.author.bot) {
        return;
    }

    // Handle AutoP messages
    const sanitized = sanitize(message.content);
    if (Config.autoP && Config.autoPusers.includes(message.author.username) && message.content !== sanitized) {
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

    const args = sanitized.slice(Config.prefix.length).split(/\s+/g);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (e) {
        console.error(e);
        message.reply('There was an error trying to execute that command!');
    }

    console.log('Handled message:', message.content);
});

client.on('error', e => console.error('Received an unexpected error', (new Date()).toString(), e));
client.on('warn', e => console.warn('Received an unexpected warning', (new Date()).toString(), e));
if (process.env.NODE_ENV === 'development') {
    client.on('debug', error => console.info(error));
}

client.login(Config.token);
