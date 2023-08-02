const { EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, bold, codeBlock, channelMention } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    cooldown: 75,
    data: {
        name: 'suggestion-submit'
    },
    async execute(interaction) {
        const data = {};
        data.user = interaction.user;

        const channel = interaction.client.channels.cache.get(process.env.VOTE_SUGGESTIONS_CHANNEL);
        const availableTags = channel.availableTags;

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('suggestion-category')
            .setPlaceholder('Suggestion Category');

        for (const tag of availableTags) {
            selectMenu.addOptions({
                label: tag.name,
                value: tag.name
            });
        }

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: bold('Select Suggestion Category'),
            components: [row],
            ephemeral: true
        });

        const response = await interaction.fetchReply();

        const collector = await response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15_000 });

        collector.on('collect', async i => {
            data.category = i.values[0];

            const modal = new ModalBuilder()
                .setCustomId('suggestion-modal')
                .setTitle(data.category)

            const title = new TextInputBuilder()
                .setCustomId('suggestion-modal-title')
                .setLabel('Title')
                .setPlaceholder('Give your suggestion a title')
                .setStyle(TextInputStyle.Short);

            const suggestion = new TextInputBuilder()
                .setCustomId('suggestion-modal-suggestion')
                .setLabel('Suggestion')
                .setPlaceholder('Explain your suggestion here in detail')
                .setStyle(TextInputStyle.Paragraph);

            const modalRow1 = new ActionRowBuilder().addComponents(title);
            const modalRow2 = new ActionRowBuilder().addComponents(suggestion);
            modal.addComponents(modalRow1, modalRow2);

            await interaction.editReply({ content: `${i.user} has selected ${data.category}!`, components: [] });

            await i.showModal(modal);

            const submitted = await interaction.awaitModalSubmit({ time: 60_000, filter: i => i.user.id === interaction.user.id }).catch((error) => {
                interaction.editReply({ content: 'Too slow, try again.' });
                return null;
            });

            if (submitted) {
                data.title = submitted.fields.getTextInputValue('suggestion-modal-title');
                data.suggestion = submitted.fields.getTextInputValue('suggestion-modal-suggestion');

                await submitted.reply({ content: bold(data.title) + '\n' + codeBlock(data.suggestion), ephemeral: true });

                interaction.editReply({ content: 'The following suggestion has been submitted, please wait for an admin to approve/deny it. It should be visible in ' + channelMention(process.env.VOTE_SUGGESTIONS_CHANNEL) + ' shortly.'})

                sendSuggestion(interaction, data);
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time' && !collected.size) interaction.editReply({ content: 'Too slow, try again.', components: [] });
        });
    },
};

function sendSuggestion(interaction, data) {
    const user = data.user;
    const title = data.title;
    const category = data.category;
    const suggestion = data.suggestion;

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(suggestion)
        .addFields({ name: 'Category', value: category })
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setFooter({ text: user.id })
        .setColor(process.env.THEME_COLOR);

    const approve = new ButtonBuilder()
        .setCustomId("suggestion-approve")
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
        .setCustomId("suggestion-deny")
        .setLabel("Deny")
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents([approve, deny]);

    const channel = interaction.client.channels.cache.get(process.env.ADMIN_SUGGESTIONS_CHANNEL);
    channel.send({ embeds: [embed], components: [row] });
}