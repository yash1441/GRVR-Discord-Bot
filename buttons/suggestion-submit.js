const { StringSelectMenuBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: {
        name: 'suggestion-submit'
    },
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("suggestion-category")
            .setPlaceholder("Suggestion Category")
            .addOptions(
                {
                    label: "1",
                    value: "1",
                },
                {
                    label: "2",
                    value: "2",
                },
                {
                    label: "3",
                    value: "3",
                },
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const response = await interaction.reply({
            content: `**Select Suggestion Category**`,
            components: [row],
            ephemeral: true
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15_000 });

        collector.on('collect', async i => {
            const selection = i.values[0];
            await interaction.editReply({ content: `${i.user} has selected ${selection}!`, components: [] });
        });
    },
};