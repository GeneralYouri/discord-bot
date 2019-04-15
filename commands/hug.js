const execute = function execute(message) {
    let str = message.author;

    const userMentions = message.mentions.users;
    const target = (userMentions.size && userMentions.first() !== message.author) ? userMentions.first() : 'themselves';
    str += ` hugs at ${target}`;

    message.channel.send(str);
};

module.exports = {
    name: 'hug',
    description: 'Hug me',
    cooldown: 5,
    execute,
};
