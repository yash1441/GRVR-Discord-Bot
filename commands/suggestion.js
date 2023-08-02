const { SlashCommandBuilder } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('suggestion')
		.setDescription('Send a suggestion')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		interaction.reply({ content: 'It works.' });
	},
};