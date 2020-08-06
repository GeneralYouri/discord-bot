const fetch = require('node-fetch');
const { Config } = require('../config-handler.js');

const execute = async function execute(message) {
    const action = Config.adultMode ? '/getrandomadult' : '/getrandom';

    try {
        const result = await fetch('https://claystk.info/jokes' + action);
        const joke = await result.json();
        message.channel.send(`${joke.Text}`);
    } catch (error) {
        console.error('Couldn\'t fetch a joke.');
        message.channel.send('It seems like I\'m going through an anti-joke phase right now. You can try again later.');
    }
};

module.exports = {
    name: 'joke',
    description: 'Let\'s joke around! Around what? You tell me!',
    cooldown: 10,
    execute,
};
