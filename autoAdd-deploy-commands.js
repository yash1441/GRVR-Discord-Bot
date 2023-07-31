const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
require("dotenv").config();

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		logger.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		logger.error(error);
	}
})();

/* 
For updating commands
rest
  .put(Routes.applicationCommands(process.env.BOT_ID), { body: commands })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
  
For deleting commands
	rest.delete(Routes.applicationCommand(process.env.BOT_ID, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);

 For deleting all commands
	 rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: [] })
		.then(() => console.log('Successfully deleted all application commands.'))
		.catch(console.error);
*/