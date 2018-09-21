const { Config, storeConfig } = require('./../config-handler');

// const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
// const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

const execute = function execute(msg, commandName, type = undefined, ...names) {
    const userSet = new Set(Config.autoPusers);

    if (!type || type === 'list') {
        msg.channel.send('Auto P Dispenser users: ' + Config.autoPusers.join(', '));
    } else if (type === 'join') {
        userSet.add(msg.author.username);
        Config.autoPusers = Array.from(userSet);
        msg.channel.send('Auto P Dispenser users: ' + Config.autoPusers.join(', '));
    } else if (type === 'quit') {
        userSet.delete(msg.author.username);
        Config.autoPusers = Array.from(userSet);
        storeConfig();
        msg.channel.send('Auto P Dispenser users: ' + Config.autoPusers.join(', '));
    // } else if (type === 'add' || type === 'delete') {
    //     names.forEach(name => userSet[type](name));
    //     Config.autoPusers = Array.from(userSet);
    //     storeConfig();
    //     msg.channel.send('Auto P Dispenser users: ' + Config.autoPusers.join(', '));
    // } else if (truthies.includes(type)) {
    //     Config.autoP = true;
    //     storeConfig();
    //     msg.channel.send('Enabled Auto P Dispenser');
    // } else if (falsies.includes(type)) {
    //     Config.autoP = false;
    //     storeConfig();
    //     msg.channel.send('Disabled Auto P Dispenser');
    }
};

module.exports = {
    name: 'autop',
    description: 'Configure the Auto P Dispenser',
    usage: '<list|join|quit>', // |add[ user1[ user2]]|delete[ user1[user2]]|on|off>',
    cooldown: 5,
    execute,
};
