const { Config } = require('./../config-handler.js');

const execute = function execute(message) {
    const userMentions = message.mentions.users;
    const target = (userMentions.size && userMentions.first() !== message.author) ? userMentions.first() : 'themselves';
    const bodyPart = Config.bodyParts[Math.floor(Math.random() * Config.bodyParts.length)];
    message.channel.send(`${message.author} kissed ${target} on the ${bodyPart}`);
};

module.exports = {
    name: 'kiss',
    description: 'Kiss me',
    cooldown: 5,
    execute,
};
