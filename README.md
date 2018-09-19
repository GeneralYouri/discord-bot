# EU Detroit Bot
A chat bot for Discord.

---

Run via
```bash
node .
```

---

## Config options:

- **`prefix`** The command prefix, when a line starts with this prefix the bot will try to match a command to run.
- **`token`** The Discord Bot token.
- **`devModeGuildID`** A single specific Guild ID, which will be the only guild(server) where the bot responds when running in Dev Mode.
- **`blacklistCommands`** An array of command names (not aliases) to disable (will also disable all aliases). A disabled command is treated as non-existant and can't be used.
- **`hiddenCommands`** An array of command names (not aliases) to hide (will also hide all aliases). A hidden command can be used normally, but will not show up in the `help` command.
- **`defaultCommandCooldown`** The default cooldown for commands that don't have their own custom cooldown. Cooldowns are per-command, AND per-user.
- **`adultMode`** Adult Mode enable various adult-only (ie not child-safe) features.
- **`bodyParts`** Body part names are used by fun commands, for example: "x punched y in the face".
- **`autoP`** Toggles a special feature that automatically sanitizes messages from specific users by replacing specific characters.
- **`autoPusers`** Configures the users for whom the above autoP feature would work, if enabled.
- **`debtStart`** The (approximate) time when Djessey's debt interest started counting.
- **`jetlagMode`** Toggles a special feature that accounts for timezone differences with certain users, by reposting their messages in the appropriate time for others.

---

## TODO

- Session handling via PM2
- Persistent storage like MongoDB
- Extract command option handling into separate files, such as the options guildOnly, dmOnly, args, and cooldown
- Improve handling of omitted Config options
- Config option to ignore specific commands (not even reply with 'cannot do anything')
- Config options to enable/disable (whitelist vs blacklist) the entire bot in certain channels
- Role/Member permissions system
- New member welcome message
- Command `broadcast` to send server-wide DMs
- Command `role` to set a member's role
- Command `kick` to kick a member from the server
- Command `quote` to get/set chat quotes
- Command `time` to get the current time in a specific timezone (can be both serious and joke)
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
