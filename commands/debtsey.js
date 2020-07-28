const { Config } = require('../config-handler');

const execute = function execute(message) {
    const debtDays = Math.floor((Date.now() - Config.debtStart.getTime()) / (24 * 60 * 60 * 1000));
    const debt = (2n ** BigInt(debtDays)).toString();
    message.channel.send(`Djessey's debt is currently ${debtDays} days old, for a total accumulated debt of ${debt.slice(0, 3) / 100}e${debt.length - 1} sausage rolls`);
};

module.exports = {
    name: 'debtsey',
    description: 'Calculate Djessey\'s current total debt',
    usage: '',
    cooldown: 5,
    execute,
};
