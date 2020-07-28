const Discord = require('discord.js');

const PERMS = Discord.Permissions.FLAGS;

const execute = function execute(message, commandName, reloadName) {
    reloadName = reloadName.toLowerCase();
    const command = message.client.commands.get(reloadName) || message.client.commands.find(cmd => cmd.alias && cmd.alias.includes(reloadName));

    if (!command) {
        message.channel.send(`The command \`${reloadName}\` doesn't exist.`);
        return;
    }

    delete require.cache[require.resolve(`./${command.name}.js`)];
    try {
        /* eslint-disable-next-line global-require, import/no-dynamic-require */
        const newCommand = require(`./${command.name}.js`);
        message.client.commands.set(newCommand.name, newCommand);
        message.react('👍');
    } catch (error) {
        console.error(error);
        message.channel.send(`There was an error while reloading the command \`${command.name}\`:\n\`${error.message}\``);
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
