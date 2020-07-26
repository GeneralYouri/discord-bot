const Discord = require('discord.js');

const PERMS = Discord.Permissions.FLAGS;

const execute = function execute(msg, commandName, reloadName) {
    reloadName = reloadName.toLowerCase();
    const command = msg.client.commands.get(reloadName) || msg.client.commands.find(cmd => cmd.alias && cmd.alias.includes(reloadName));

    if (!command) {
        msg.channel.send(`The command \`${reloadName}\` doesn't exist.`);
        return;
    }

    delete require.cache[require.resolve(`./${command.name}.js`)];
    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const newCommand = require(`./${command.name}.js`);
        msg.client.commands.set(newCommand.name, newCommand);
        msg.channel.send(`The command \`${command.name}\` was reloaded!`);
    } catch (error) {
        console.error(error);
        msg.channel.send(`There was an error while reloading the command \`${command.name}\`:\n\`${error.message}\``);
    }
};

module.exports = {
    name: 'reload',
    description: 'Reload the given command',
    permissions: PERMS.ADMINISTRATOR,
    arguments: 1,
    usage: '<command name>',
    cooldown: 5,
    execute,
};
