const { Config } = require('./../config-handler.js');

const execute = function execute(msg, args) {
    msg.channel.send(Config.serverDetails);
};

module.exports = {
    name: 'details',
    description: 'Show the Server Details message',
    execute,
};
