const { EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, bold, codeBlock } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: {
        name: 'suggestion-submit'
    },
    async execute(interaction) {
        const data = {};
        data.user = interaction.user;
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

        const collector = await response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15_000 });

        collector.on('collect', async i => {
            data.category = i.values[0];

            console.log(i);

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
            await interaction.editReply({ content: `${i.user} has selected ${data.category}!`, components: [] });

            await i.showModal(modal);

            const submitted = await interaction.awaitModalSubmit({ time: 30_000, filter: i => i.user.id === interaction.user.id }).catch((error) => logger.error(error));

            if (submitted) {
                data.suggestion = submitted.fields.getTextInputValue('suggestion-modal-suggestion');

                await submitted.reply({ content: codeBlock(data.suggestion), ephemeral: true });

                sendSuggestion(interaction, data);
            } else interaction.editReply({ content: 'Too slow, try again.', ephemeral: true });
        });

        // collector.on('end',(collected, reason)  => {
        //     if (reason === 'time' && !collected.size) interaction.editReply({ content: 'Too slow, try again.', components: [], ephemeral: true });
        // });
    },
};

function sendSuggestion(interaction, data) {
    const user = data.user;
    const category = data.category;
    const suggestion = data.suggestion;

    const embed = new EmbedBuilder()
        .setTitle(category)
        .setDescription(suggestion)
        .setAuthor({ name: user.username })
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: user.id });

    const approve = ButtonBuilder()
        .setCustomId("suggestion-approve")
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success);

    const deny = ButtonBuilder()
        .setCustomId("suggestion-deny")
        .setLabel("Deny")
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents([approve, deny]);

    const channel = interaction.client.channels.cache.get(process.env.ADMIN_SUGGESTIONS_CHANNEL);
    channel.send({ embeds: [embed], components: [row] });
}