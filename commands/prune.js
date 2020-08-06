const Discord = require('discord.js');

const PERMISSIONS = Discord.Permissions.FLAGS;

const execute = function execute(message, commandName, amountStr) {
    const amount = parseInt(amountStr, 10);
    if (Number.isNaN(amount)) {
        message.react('❌');
        message.reply('that doesn\'t seem to be a valid number.');
        return;
    }
    if (amount < 1 || amount > 99) {
        message.react('❌');
        message.reply('you need to input a number between 1 and 99.');
        return;
    }

    message.channel.bulkDelete(amount + 1, true);
};

module.exports = {
    name: 'prune',
    description: 'Delete messages',
    permissions: PERMISSIONS.MANAGE_MESSAGES,
    guildOnly: true,
    arguments: 1,
    usage: '<amount>',
    cooldown: 5,
    execute,
};
