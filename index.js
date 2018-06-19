const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    // const { content: txt, channel: ch, guild } = msg;
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) {
        return;
    }

    const args = msg.content.slice(config.prefix.length).split(/\s+/g);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        msg.reply('pong');
    } else {
        msg.reply('ping');
    }

    console.log('Handled message:', msg.content);
});

client.login(config.token);
