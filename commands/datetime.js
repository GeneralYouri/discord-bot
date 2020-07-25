const optionsDate = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
};
const optionsTime = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
};

const execute = function execute(message, commandName, timeZone) {
    const options = {
        ...(commandName.includes('date') ? optionsDate : {}),
        ...(commandName.includes('time') ? optionsTime : {}),
        timeZoneName: 'short',
        timeZone,
    };

    const formatter = new Intl.DateTimeFormat('nl-NL', options);
    const timeStr = formatter.format(new Date());
    message.channel.send(`It's currently ${timeStr}`);
};

// TODO: Accept more commonly used timezone names like UTC61 or GMT+1
module.exports = {
    name: 'datetime',
    alias: ['time', 'date'],
    description: 'Get the current date/time in the given timezone',
    permissions: 0x0,
    arguments: 1,
    usage: '<timezone>',
    cooldown: 5,
    execute,
};
