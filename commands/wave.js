const execute = function execute(message) {
    const userMentions = message.mentions.users;
    const target = (userMentions.size && userMentions.first() !== message.author) ? userMentions.first() : 'themselves';

    message.channel.send(`${message.author.username} waves at ${target}`);
};

module.exports = {
    name: 'wave',
    description: 'Wave at me',
    cooldown: 5,
    execute,
};
