const questions = [
    { name: 'Youri\'s Status', regex: /(what(\si|')?s\s)?youri?'?s\sstatus\???/, answer: 'Slacking' },
    { name: 'Who is slacking?', regex: /(who(\si|')?s\s)slacking\???/, answer: '<@86026137527918592> is!' },
    { name: 'Who is the best programmer?', regex: /(who(\si|')?s\s)?(the\s)?best\sprogrammer\??/, answer: '<@86026137527918592> is!' },
    { name: 'Who is Luke\'s father?', regex: /(who(\si|')?s\s)?luke'?s\sfather\??/, answer: '***No Spoilers!***' },
    { name: 'Fake News Trumps All', regex: /fake\s?news\??/, answer: 'Fake News Trumps All! Or was it Trumps All Fake News? ..I don\'t remember' },
    { name: 'Who created you?', regex: /(who(\shas|'s)?\s)?create(d)?\syou\??/, answer: 'My lord and creator, <@86026137527918592>!' },
    { name: 'Who is your creator?', regex: /(who(\si|')s?\s)?your\screator\??/, answer: 'My lord and creator, <@86026137527918592>!' },
    { name: 'Where do you live?', regex: /where(\sdo)?\syou\slive\??/, answer: 'In the best place in the world of course, EU Detroit!' },
];

const execute = function execute(message, commandName, ...args) {
    const query = args.join(' ').toLowerCase();
    const question = questions.find(q => q.regex.test(query));
    if (!question) {
        message.reply('How am I supposed to know?!');
        return;
    }

    message.reply(question.answer);
};

module.exports = {
    name: 'ask',
    description: 'I will answer all of your questions.. if I know the answer!',
    arguments: 1,
    usage: '<what is your question?>',
    execute,
};
