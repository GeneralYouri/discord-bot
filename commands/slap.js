const { Config } = require('./../config-handler.js');

const execute = function execute(message) {
    let str = message.author;

    const userMentions = message.mentions.users;
    const target = (userMentions.size && userMentions.first() !== message.author) ? userMentions.first() : 'themselves';
    str += ` slaps ${target} with a stinky sock`;

    if (Array.isArray(Config.bodyParts) && Config.bodyParts.length > 1) {
        const bodyPart = Config.bodyParts[Math.floor(Math.random() * Config.bodyParts.length)];
        str += ` on the ${bodyPart}`;
    }

    message.channel.send(str);
};

module.exports = {
    name: 'slap',
    description: 'Slap me',
    cooldown: 5,
    execute,
};
