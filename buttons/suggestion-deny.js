const { EmbedBuilder } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: {
        name: 'suggestion-deny'
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const oldEmbed = interaction.message.embeds[0];

        const newEmbed = EmbedBuilder.from(oldEmbed).setColor(process.env.RED_COLOR)

        interaction.message.edit({ embeds: [newEmbed], components: [] });

        interaction.deleteReply();
    },
};