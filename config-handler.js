const fs = require('fs');

/**
 * @property {string} token -The Discord Bot token.
 * @property {string} prefix - The command prefix, when a line starts with this prefix the bot will try to match a command to run.
 * @property {string} [devModeGuildID] - A single specific Guild ID, which will be the only guild(server) where the bot responds when running in Dev Mode.
 * @property {number} [defaultCommandCooldown] - The default cooldown for commands that don't have their own custom cooldown. Cooldowns are per-command, AND per-user.
 * @property {[string]} [hiddenCommands] - The command names (not aliases) to hide (will also hide all aliases). A hidden command can be used normally, but will not show up in the `help` command.
 * @property {[string]} [blacklistCommands] - The command names (not aliases) to disable (will also disable all aliases). A disabled command can't be used AND won't show up anywhere.
 * @property {[string]} [blacklistUsers] - User IDs who are not allowed to interact with the bot.
 * @property {[string]} [adminUsers] - User IDs who have special bot privileges, generally for administrative purposes.
 * @property {boolean} [autoP] - Toggles a special feature that automatically sanitizes messages from specific users by replacing specific characters.
 * @property {string} [autoPusers] - User IDs for whom to use the autoP feature, if enabled.
 * @property {boolean} [jetlagMode] - Toggles a special feature that accounts for timezone differences with certain users, by reposting their messages in the appropriate time for others.
 * @property {[string]} [jetlagUsers] - User IDs for whom to use the jetlag feature, if enabled. Also includes the user-specific jetlag time delays to be used.
 * @property {number} [debtStart] - The (approximate) time when Djessey's debt interest started counting.
 * @property {boolean} [adultMode] - Enables various adult-only (ie not child-safe) features.
 * @property {[string]} [bodyParts] - Body part names are used by fun commands, for example: "x punched y in the face".
 */
let Config;

// Read from config from files and apply custom parsing rules
const loadConfig = function loadConfig() {
    try {
        /* eslint-disable-next-line global-require */
        const config = require('./config.json');

        config.debtStart = new Date(config.debtStart);

        Config = config;
        return config;
    } catch (e) {
        console.error('Could not read from config files', e);
        throw e;
    }
};

// Strip custom parsing rules and write to config.json
const storeConfig = function storeConfig() {
    const newConfig = { ...Config };

    const configJson = JSON.stringify(newConfig, null, 4);
    try {
        fs.writeFileSync(require.resolve('./config.json'), configJson, 'utf-8');
    } catch (e) {
        console.error('Could not write to config file', e);
        throw e;
    }
};

Config = loadConfig();

module.exports = { Config, loadConfig, storeConfig };
