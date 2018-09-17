const questions = [
    { name: 'Youri\'s Status', regex: /(what(\si|')?s\s)?clayc?'?s\sstatus\???/, answer: 'Slacking' },
    { name: 'Who is slacking?', regex: /(who(\si|')?s\s)slacking\???/, answer: '<@86026137527918592> is!' },
    { name: 'Who is the best programmer?', regex: /(who(\si|')?s\s)?the\sbest\sprogrammer\??/, answer: '<@86026137527918592> is!' },
    { name: 'Who is Luke\'s father?', regex: /(who(\si|')?s\s)?luke'?s\sfather\??/, answer: '***No Spoilers!***' },
    { name: 'Fake News Trumps All', regex: /fake\s?news\??/, answer: 'Fake News Trumps All! Or was it Trumps All Fake News? ..I don\'t remember' },
    { name: 'Who created you?', regex: /(who(\shas|'s)?\s)?create(d)?\syou\??/, answer: 'My lord and creator, <@86026137527918592>!' },
    { name: 'Who is your creator?', regex: /(who(\si|')s?\s)?your\screator\??/, answer: 'My lord and creator, <@86026137527918592>!' },
    { name: 'Where do you live?', regex: /where(\sdo)?\syou\slive\??/, answer: 'In the best place in the world ofcourse, EU Detroit!' },
];

const execute = function execute(message, commandName, ...args) {
    const str = args.join(' ').toLowerCase();
    for (const question of questions) {
        if (question.regex.test(str)) {
            return message.reply(question.answer);
        }
    }

    message.reply('How am I supposed to know?!');
};

module.exports = {
    name: 'ask',
    description: 'I will answer all of your questions.. if I know the answer!',
    args: true,
    usage: '<what is your question?>',
    execute,
};
