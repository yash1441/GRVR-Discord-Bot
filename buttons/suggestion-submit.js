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

        const message = await interaction.reply({
            content: `**Select Suggestion Category**`,
            components: [row],
            ephemeral: true
        });

        const collectorFilter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        message.awaitMessageComponent({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 15000 })
            .then(interaction => interaction.reply(`You selected ${interaction.values.join(', ')}!`))
            .catch(err => {
                console.log(err);
                logger.debug('No interactions were collected.')
            });
    },
};