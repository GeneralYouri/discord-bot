const variations = ['Pong', 'Pong.', 'Pong!', 'Pong?', 'PONG', '~~Ping~~Pong', 'ᵖᵒᶰᵍ', '*miss*'];

const execute = function execute(message) {
    const index = Math.trunc(Math.random() * variations.length);
    message.reply(variations[index]);
};

module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '',
    execute,
};
