const execute = function execute(message) {
    const userMentions = message.mentions.users;
    const target = (userMentions.size && userMentions.first() !== message.author) ? userMentions.first() : 'themselves';
    message.channel.send(`${message.author} hugged ${target}`);
};

module.exports = {
    name: 'hug',
    description: 'Hug me',
    cooldown: 5,
    execute,
};
