const { StringSelectMenuBuilder, ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, bold } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: {
        name: 'suggestion-submit'
    },
    async execute(interaction) {
        const data = {};
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('suggestion-category')
            .setPlaceholder('Suggestion Category')
            .addOptions(
                {
                    label: '1',
                    value: '1',
                },
                {
                    label: '2',
                    value: '2',
                },
                {
                    label: '3',
                    value: '3',
                },
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const response = await interaction.reply({
            content: bold('Select Suggestion Category'),
            components: [row],
            ephemeral: true
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15_000 });

        collector.on('collect', async i => {
            data.category = i.values[0];

            const modal = new ModalBuilder()
                .setCustomId('suggestion-modal')
                .setTitle(data.category)

            const suggestion = new TextInputBuilder()
                .setCustomId('suggestion-modal-suggestion')
                .setLabel('Suggestion')
                .setPlaceholder('Explain your suggestion here in detail')
                .setStyle(TextInputStyle.Paragraph);

            const modalRow = new ActionRowBuilder().addComponents(suggestion);

            modal.addComponents(modalRow);
            await response.edit({ content: `${i.user} has selected ${data.category}!`, components: [] });

            await i.showModal(modal);
        });


        // Show Modal

        // Collect Modal

        // Send to Thread
    },
};