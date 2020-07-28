const { Config } = require('../config-handler.js');

const execute = function execute(message) {
    const userMentions = message.mentions.users;
    const target = (userMentions.size && userMentions.first() !== message.author) ? userMentions.first() : 'themselves';
    let str = `${message.author.username} kisses ${target}`;

    if (Array.isArray(Config.bodyParts) && Config.bodyParts.length > 1) {
        const bodyPart = Config.bodyParts[Math.floor(Math.random() * Config.bodyParts.length)];
        str += ` on the ${bodyPart}`;
    }

    message.channel.send(str);
};

module.exports = {
    name: 'kiss',
    description: 'Kiss me',
    cooldown: 5,
    execute,
};
