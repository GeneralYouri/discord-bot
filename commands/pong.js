const variations = ['Ping', 'Ping.', 'Ping!', 'Ping?', 'PING', '~~Pong~~Ping', 'ᵖᶦᶰᵍ', '*miss*'];

const execute = function execute(message) {
    const index = Math.trunc(Math.random() * variations.length);
    message.reply(variations[index]);
};

module.exports = {
    name: 'pong',
    description: 'Pong!',
    usage: '',
    execute,
};
