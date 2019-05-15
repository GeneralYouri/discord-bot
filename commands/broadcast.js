const Discord = require('discord.js');

const PERMS = Discord.Permissions.FLAGS;

const execute = function execute(message, commandName, ...args) {
    const str = args.join(' ').toLowerCase();
    message.guild.members.forEach((member) => {
        console.log(member);
        if (!member.user.bot) {
            member.send(str, { split: true });
        }
    });
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