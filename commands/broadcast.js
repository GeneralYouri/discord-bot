const Discord = require('discord.js');

const PERMS = Discord.Permissions.FLAGS;

const execute = function execute(message, commandName, ...args) {
    const broadcast = args.join(' ').toLowerCase();
    message.guild.members.forEach((member) => {
        console.log(member);
        if (!member.user.bot) {
            member.send(broadcast, { split: true });
        }
    });
    message.react('👍');
};

module.exports = {
    name: 'broadcast',
    description: 'Send a server-wide DM',
    permissions: PERMS.MENTION_EVERYONE,
    guildOnly: true,
    arguments: 1,
    usage: '<text message>',
    cooldown: 60,
    execute,
};
