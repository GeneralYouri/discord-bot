const { Config, storeConfig } = require('./../config-handler');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

const userSet = new Map(Object.entries(Config.jetlagUsers));

const execute = function execute(msg, commandName, type = undefined, name, delay) {
    if (!type || type === 'status') {
        msg.channel.send(`Jetlag Mode is currently ${Config.jetlagMode ? `enabled for ${userSet.size} users` : 'disabled'}`);
    } else if (type === 'list') {
        const ids = Array.from(userSet.keys());
        const data = ids.map(id => `${msg.client.users.get(id).username} with a delay of ${userSet.get(id)} hrs`);
        msg.channel.send('Jetlag Mode users:\n' + data.join('\n'));
    } else if (type === 'join') {
        delay = name;
        userSet.set(msg.author.id, delay);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        msg.channel.send(`Added Jetlag Mode for ${msg.author.username} with delay ${delay}`);
    } else if (type === 'quit') {
        userSet.delete(msg.author.id);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        msg.channel.send(`Removed Jetlag Mode for ${msg.author.username}`);
    } else if (type === 'add') {
        const { id } = msg.client.users.find(user => user.username === name);
        userSet.set(id, delay);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        msg.channel.send(`Added Jetlag Mode for ${name} with delay ${delay}`);
    } else if (type === 'remove') {
        const { id } = msg.client.users.find(user => user.username === name);
        userSet.delete(id);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        msg.channel.send(`Removed Jetlag Mode for ${name}`);
    } else if (truthies.includes(type)) {
        Config.jetlagMode = true;
        storeConfig();
        msg.channel.send('Enabled Jetlag Mode');
    } else if (falsies.includes(type)) {
        Config.jetlagMode = false;
        storeConfig();
        msg.channel.send('Disabled Jetlag Mode');
    }
};

module.exports = {
    name: 'jetlag',
    description: 'Configure Jetlag Mode',
    usage: '<status|list|join delay|quit|add user delay|remove user|on|off>',
    cooldown: 5,
    execute,
};
