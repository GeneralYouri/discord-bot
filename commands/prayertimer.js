const fetch = require('node-fetch');
const schedule = require('node-schedule');
const { Config, storeConfig } = require('../config-handler');


const displayTimeConfig = (hours) => {
    const seconds = hours * 60 * 60;
    const s = (seconds % 60).toString().padStart(2, '0');
    const m = Math.trunc(seconds / 60).toString().padStart(2, '0');
    const h = Math.trunc(hours).toString().padStart(2, '0');

    if (hours >= 1) {
        return `${h}:${m}:${s} hours`;
    } else if (seconds >= 60) {
        return `${m}:${s} minutes`;
    } else {
        return `${s} seconds`;
    }
};

const channelID = '344155314205097986';
const sendReminder = async (client, prayer, message) => {
    if (!Config.prayerTimer) {
        return;
    }

    Config.prayerTimerUsers.forEach(async (id) => {
        const user = await client.users.fetch(id);
        user.send(message);
    });
    if (Config.prayerTimerGlobal) {
        const channel = await client.channels.fetch(channelID);
        channel.send(message);
    }
};

const prayers = ['Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const setupReminders = async (client) => {
    try {
        const result = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Arnhem&country=Netherlands&method=13&latitudeAdjustmentMethod=2&tune=0,0,0,6,5,6,0,0,0');
        const { data: { timings } } = await result.json();

        prayers.forEach((prayer, index) => {
            const startTime = (new Date(`${(new Date()).toDateString()} ${timings[prayer]}`)).getTime();
            if (startTime - Date.now() > 0) {
                const message = `The ${prayer} prayer has started.`;
                setTimeout(() => sendReminder(client, prayer, message), startTime - Date.now());
            }

            if (index + 1 < prayers.length) {
                const nextStartTime = (new Date(`${(new Date()).toDateString()} ${timings[prayers[index + 1]]}`)).getTime();
                const reminderTime = nextStartTime - Config.prayerTimerReminderTime * 60 * 60 * 1000;
                if (reminderTime - Date.now() > 0) {
                    const message = `There are ${displayTimeConfig(Config.prayerTimerReminderTime)} left for the ${prayer} prayer.`;
                    setTimeout(() => sendReminder(client, prayer, message), reminderTime - Date.now());
                }
            }

            console.log(`Setup ${prayer} reminder for ${timings[prayer]}`);
        });
    } catch (error) {
        console.error('Couldn\'t fetch prayer timer data.');
    }
};

const setup = async function setup(client) {
    const nextCron = schedule.scheduleJob('0 5 0 * * *', () => setupReminders(client));
    if (nextCron.nextInvocation().getDate() !== (new Date()).getDate()) {
        setupReminders(client);
    }
};


const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];
const requiresAdmin = ['add', 'remove', 'on', 'off'];

const userSet = new Set(Config.prayerTimerUsers ?? []);

const execute = function execute(message, commandName, type = undefined, name = undefined, delay = undefined) {
    if (truthies.includes(type)) {
        type = 'on';
    } else if (falsies.includes(type)) {
        type = 'off';
    }

    if (requiresAdmin.includes(type) && !Config.adminUsers.includes(message.author.id)) {
        message.react('❌');
        message.reply('You\'re not allowed to use this command');
        return;
    }

    if (!type || type === 'status') {
        message.channel.send(`Prayer Timer is currently ${Config.prayerTimer ? `enabled for ${userSet.size} users` : 'disabled'}`);
    } else if (type === 'on') {
        Config.prayerTimer = true;
        storeConfig();
        message.react('👍');
    } else if (type === 'off') {
        Config.prayerTimer = false;
        storeConfig();
        message.react('👍');
    } else if (type === 'list') {
        const ids = Array.from(userSet.keys());
        const data = ids.map(id => `${message.client.users.get(id).username}`);
        message.channel.send(`Prayer Timer users:\n${data.join(', ')}`);
    } else if (type === 'join') {
        userSet.add(message.author.id);
        Config.prayerTimerUsers = Array.from(userSet);
        storeConfig();
        message.react('👍');
    } else if (type === 'quit') {
        userSet.delete(message.author.id);
        Config.prayerTimerUsers = Array.from(userSet);
        storeConfig();
        message.react('👍');
    } else if (type === 'add') {
        const { id } = message.client.users.find(user => user.username === name);
        userSet.add(id);
        Config.prayerTimerUsers = Array.from(userSet);
        storeConfig();
        message.react('👍');
    } else if (type === 'remove') {
        const { id } = message.client.users.find(user => user.username === name);
        userSet.delete(id);
        Config.prayerTimerUsers = Array.from(userSet);
        storeConfig();
        message.react('👍');
    }
};

module.exports = {
    name: 'prayertimer',
    description: 'Configure the Prayer Timer / Reminder',
    arguments: 1,
    usage: '{status|on|off|list|join|quit} | {add|remove} <user>',
    cooldown: 5,
    setup,
    execute,
};
