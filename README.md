# EU Detroit Bot
A chat bot for Discord.

---

Run via
```bash
node .
```

---

## Config options:

- **`token`** The Discord Bot token.
- **`prefix`** The command prefix, when a line starts with this prefix the bot will try to match a command to run.
- **`devModeGuildID`** A single specific Guild ID, which will be the only guild(server) where the bot responds when running in Dev Mode.
- **`defaultCommandCooldown`** The default cooldown in seconds for commands that don't have their own custom cooldown. Cooldowns are per-command, AND per-user.
- **`hiddenCommands`** The command names (not aliases) to hide (will also hide all aliases). A hidden command can be used normally, but will not show up in the `help` command.
- **`blacklistCommands`** The command names (not aliases) to disable (will also disable all aliases). A disabled command can't be used AND won't show up anywhere.
- **`blacklistUsers`** User IDs who are not allowed to interact with the bot.
- **`adminUsers`** User IDs who have special bot privileges, generally for administrative purposes.
- **`autoP`** Toggles a custom feature that automatically sanitizes messages from users by replacing specific characters.
- **`autoPUsers`** User IDs for whom to use the autoP feature, if enabled.
- **`jetlagMode`** Toggles a custom feature that accounts for timezone differences with users, by reposting their messages in the appropriate time for others.
- **`jetlagUsers`** User IDs for whom to use the jetlag feature, if enabled. Also includes the user-specific jetlag time delays to be used, in hours.
- **`prayerTimer`** Toggles a custom feature that reminds users about Islam prayer times.
- **`prayerTimerUsers`** User IDs for whom to use the prayer timer feature, if enabled.
- **`prayerTimerReminderTime`** The amount of warning time to give when reminding users when the current prayer is ending, in hours.
- **`prayerTimerGlobal`** Whether to also send prayer reminder messages "globally", as in, in a public channel.
- **`prayerTimerGlobalChannelID`** The channel ID to which the global prayer reminder messages are sent.
- **`debtStart`** The (approximate) Unix timestamp when Djessey's debt interest started counting.
- **`adultMode`** Enables various adult-only (ie not child-safe) features.
- **`bodyParts`** Names of body parts to be used by fun commands, for example: "x punched y in the face".

---

## TODO

- Replace config option `adminUsers` with Permissions
- Add remind-me type feature for prayer times
- Add function for loose username search

- Session handling via PM2
- Persistent storage like MongoDB
- Extract command option handling into separate files, such as the options permissions, guildOnly, dmOnly, arguments, and cooldown
- Improve handling of omitted Config options
- Config option to ignore specific commands (not even reply with 'cannot do anything')
- Config options to enable/disable (whitelist vs blacklist) the entire bot in certain channels
- New member welcome message
- Command `role` to set a member's role
- Command `kick` to kick a member from the server
- Command `quote` to get/set chat quotes
- Command `upload` to upload gallery images
- Command `ratejoke` (Name not finalized) to rate the most recent joke sent by the bot
- Command `topspammer` (Name not finalized) to identify who's been spamming the most messages recently
- Command option `hidden` to hide the command from `help`
- Add nsfw bodyparts for Adult Mode
- Add more questions for command `ask`
- Fix fun commands to support role mentions
-

## License

MIT © Youri Bok

---
