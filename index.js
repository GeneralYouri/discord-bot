const fs = require('fs');
const Discord = require('discord.js');
const { Config } = require('./config-handler.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}


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

client.on('message', (msg) => {
    if (msg.author.bot) {
        return;
    }

    // Handle AutoP messages
    const sanitized = sanitize(msg.content);
    if (Config.autoP && Config.autoPusers.includes(msg.author.username) && msg.content !== sanitized) {
        msg.channel.send(`${msg.author} said: ${sanitized}`);
    }

    // Handle Jetlag Mode messages
    if (Config.jetlagMode && msg.author.username === 'MHBudak') {
        setTimeout(() => {
            if (Config.jetlagMode) {
                msg.channel.send(`${msg.author} said 7hrs ago: ${sanitized}`);
            }
        }, 7 * 60 * 60 * 1000);
    }

    if (!msg.content.startsWith(Config.prefix)) {
        return;
    }

    const args = sanitized.slice(Config.prefix.length).split(/\s+/g);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (e) {
        console.error(e);
        msg.reply('There was an error trying to execute that command!');
    }

    console.log('Handled message:', msg.content);
});

client.on('error', e => console.error('Received an unexpected error', (new Date()).toString(), e));
client.on('warn', e => console.warn('Received an unexpected warning', (new Date()).toString(), e));
client.on('debug', e => console.info(e));

client.login(Config.token);
