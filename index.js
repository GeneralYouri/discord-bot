const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if (msg.author.bot) {
        return;
    }

    // TODO: Make the username match dynamic / Add Araniir
    if (msg.author.username === 'Youri' && msg.content.includes('[')) {
        msg.channel.send(`${msg.author} said: ${msg.content.replace(/\[/g, 'p')}`);
        // msg.reply('oh, ik zie dat je pP het niet doet, alsjeblieft');
    }

    if (!msg.content.startsWith(config.prefix)) {
        return;
    }

    const args = msg.content.slice(config.prefix.length).split(/\s+/g);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        msg.reply('pong');
    } else if (command === 'pong') {
        msg.reply('ping');
    } else if (command === 'pp') {
        msg.reply('pP');
    }

    console.log('Handled message:', msg.content);
});

client.login(config.token);
