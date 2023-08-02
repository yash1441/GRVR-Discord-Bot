const { SlashCommandBuilder } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channels')
        .setDescription('Get data from channels.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('channel-id')
                .setDescription('Enter the ID of channel')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channelId = interaction.options.getString('channel-id');
        const channel = interaction.channels.cache.get(channelId);

        console.log(channel);

        interaction.reply({ content: 'Check console for output.', ephemeral: true });
    },
};