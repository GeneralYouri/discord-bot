const Big = require('big.js');
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
    if (config.autoP.includes(msg.author.username) && (msg.content.includes('[') || msg.content.includes(']'))) {
        const sanitized = msg.content.replace(/\[/g, 'p').replace(/]/g, 'P');
        msg.channel.send(`${msg.author} said: ${sanitized}`);
    }

    if (!msg.content.startsWith(config.prefix)) {
        return;
    }

    const noPrefix = msg.content.slice(config.prefix.length);
    const args = noPrefix.split(/\s+/g);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        msg.reply('pong');
    } else if (command === 'pong') {
        msg.reply('ping');
    } else if (command === 'debtsey') {
        const debtStart = new Date(config.debtStart);
        const debtDays = Math.floor((Date.now() - debtStart.getTime()) / (1000 * 60 * 60 * 24));
        const debt = new Big(2).pow(debtDays);
        msg.reply(`Djessey's debt is currently ${debtDays} days old, for a total accumulated debt of ${debt.toExponential(2)} sausage rolls`);
    } else if (noPrefix === 'pP') {
        msg.reply('pP');
    }

    console.log('Handled message:', msg.content);
});

client.login(config.token);
