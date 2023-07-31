const { SlashCommandBuilder } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
	data: {
        name: 'suggestion-submit',
        type: 'BUTTON'
    },
	async execute(interaction) {
		interaction.reply({ content: 'It works.' });
	},
};