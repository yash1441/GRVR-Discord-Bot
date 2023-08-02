const { SlashCommandBuilder } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('threads')
        .setDescription('Get data from threads.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('channel-id')
                .setDescription('Enter the ID of channel')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('thread-id')
                .setDescription('Enter the ID of thread')
                .setRequired(true)
        ),
    async execute(interaction) {
        const threadId = interaction.options.getString('thread-id');
        const channelId = interaction.options.getString('channel-id');
        const channel = interaction.client.channels.cache.get(channelId);
        const thread = channel.threads.cache.find(x => x.id === threadId);

        console.log(thread);

        interaction.reply({ content: 'Check console for output.', ephemeral: true });
    },
};