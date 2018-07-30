const fs = require('fs');
const Big = require('big.js');
const Discord = require('discord.js');
const config = require('./config.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}


const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

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
    if (config.autoP.enabled && config.autoP.users.has(msg.author.username) && msg.content !== sanitized) {
        msg.channel.send(`${msg.author} said: ${sanitized}`);
    }

    // Handle Jetlag Mode messages
    if (config.jetlagMode && msg.author.username === 'MHBudak') {
        setTimeout(() => {
            if (config.jetlagMode) {
                msg.channel.send(`${msg.author} said 7hrs ago: ${sanitized}`);
            }
        }, 7 * 60 * 60 * 1000);
    }

    if (!msg.content.startsWith(config.prefix)) {
        return;
    }

    const noPrefix = sanitized.slice(config.prefix.length);
    const args = noPrefix.split(/\s+/g);
    const command = args.shift().toLowerCase();

    // if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        // console.error(error);
        // msg.reply('There was an error trying to execute that command!');
    }

    if (command === 'jetlag') {
        if (args.length === 0) {
            msg.channel.send('Jetlag Mode is currently ' + (config.jetlagMode ? 'enabled' : 'disabled'));
        } else if (truthies.includes(args[0])) {
            config.jetlagMode = true;
            msg.channel.send('Enabled Jetlag Mode');
        } else if (falsies.includes(args[0])) {
            config.jetlagMode = false;
            msg.channel.send('Disabled Jetlag Mode');
        }
    } else if (command === 'autop') {
        if (args.length === 0 || (args.length === 1 && args[0] === 'list')) {
            msg.channel.send('Auto P Dispenser users: ' + Array.from(config.autoP.users).join(', '));
        } else if (args.length === 1) {
            if (truthies.includes(args[0])) {
                config.autoP.enabled = true;
                msg.channel.send('Enabled Auto P Dispenser');
            } else if (falsies.includes(args[0])) {
                config.autoP.enabled = false;
                msg.channel.send('Disabled Auto P Dispenser');
            } else if (args[0] === 'join') {
                config.autoP.users.add(msg.author.username);
                msg.channel.send('Auto P Dispenser users: ' + Array.from(config.autoP.users).join(', '));
            } else if (args[0] === 'quit') {
                config.autoP.users.delete(msg.author.username);
                msg.channel.send('Auto P Dispenser users: ' + Array.from(config.autoP.users).join(', '));
            }
        } else if (args[0] === 'add' || args[0] === 'delete') {
            args.slice(1).forEach(name => config.autoP.users[args[0]](name));
            msg.channel.send('Auto P Dispenser users: ' + Array.from(config.autoP.users).join(', '));
        }
    } else if (noPrefix === 'pP') {
        msg.reply('pP');
    }

    console.log('Handled message:', msg.content);
});

client.on('error', e => console.error('Received an unexpected error', (new Date()).toString(), e));
client.on('warn', e => console.warn('Received an unexpected warning', (new Date()).toString(), e));
client.on('debug', e => console.info(e));

client.login(config.token);
