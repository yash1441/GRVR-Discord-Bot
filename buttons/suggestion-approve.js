const { EmbedBuilder, userMention } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: {
        name: 'suggestion-approve'
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const oldEmbed = interaction.message.embeds[0];

        const newEmbed = EmbedBuilder.from(oldEmbed).setColor(process.env.GREEN_COLOR)

        interaction.message.edit({ content: '✅ '+ userMention(interaction.user.id) + ' ✅', embeds: [newEmbed], components: [] });

        const data = {
            username: oldEmbed.author.name,
            id: oldEmbed.footer.text,
            icon: oldEmbed.author.iconURL,
            title: oldEmbed.title,
            category: oldEmbed.fields[0].value,
            suggestion: oldEmbed.description
        }

        createForumPost(interaction, data);

        interaction.deleteReply();
    },
};

function createForumPost(interaction, data) {
    const channel = interaction.client.channels.cache.get(process.env.VOTE_SUGGESTIONS_CHANNEL);
    const availableTags = channel.availableTags;
    let tagId;

    for (const tag of availableTags) {
        if (tag.name == data.category) {
            tagId = tag.id;
            break;
        }
    }
    const embed = new EmbedBuilder()
        .setAuthor({ name: data.username, iconURL: data.icon })
        .setDescription(data.suggestion)
        .setColor(process.env.THEME_COLOR)
        .setFooter({ text: data.id });
    channel.threads.create({ name: data.title, reason: 'Approved by ' + interaction.user.username, message: { embeds: [embed] }, appliedTags: [tagId] });
}