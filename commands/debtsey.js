const Big = require('big.js');
const { Config } = require('./../config-handler');

const execute = function execute(msg, args) {
    const debtDays = Math.floor((Date.now() - Config.debtStart.getTime()) / (1000 * 60 * 60 * 24));
    const debt = new Big(2).pow(debtDays);
    msg.reply(`Djessey's debt is currently ${debtDays} days old, for a total accumulated debt of ${debt.toExponential(2)} sausage rolls`);
};

module.exports = {
    name: 'debtsey',
    description: 'Calculate Djessey\'s current total debt',
    execute,
};
