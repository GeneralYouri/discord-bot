const { Config } = require('../config-handler.js');

const execute = async function execute(message, commandName, name) {
    const data = [];
    const { commands } = message.client;

    if (!name) {
        // List available commands
        data.push('Here\'s a list of all my commands:');
        data.push(commands.filter(command => !command.hidden).map(command => command.name).join(', '));
        data.push('');
        data.push(`Use \`${Config.prefix}help <command name>\` to get info on a specific command.`);

        try {
            await message.author.send(data.join('\n'), { split: true });
            if (message.channel.type !== 'dm') {
                message.reply('I\'ve sent you a DM with all my commands.');
            }
        } catch (error) {
            console.error(`Could not send help DM to ${message.author.tag}.`);
            console.error(error);
            message.reply('it seems like I can\'t DM you. Do you have DMs disabled?');
        }
    } else {
        // List command-specific help
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        if (!command || command.hidden) {
            message.reply('I don\'t know that command, can you teach me?');
            return;
        }

        data.push(`**Command:** ${command.name}`);
        if (command.alias) {
            data.push(`**Aliases:** ${command.alias.join(', ')}`);
        }
        if (command.description) {
            data.push(`**Description:** ${command.description}`);
        }
        if (command.usage) {
            data.push(`**Usage:** \`${Config.prefix}${command.name} ${command.usage}\``);
        }
        if (command.cooldown) {
            data.push(`**Cooldown:** ${command.cooldown || 3} second${(command.cooldown === 1) ? '' : 's'}`);
        }

        message.channel.send(data.join('\n'), { split: true });
    }
};

module.exports = {
    name: 'help',
    description: 'List all of my commands or get info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    execute,
};
