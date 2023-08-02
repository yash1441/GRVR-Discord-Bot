const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('threads')
        .setDescription('Get data from threads.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('thread')
                .setDescription('Select the thread')
                .addChannelTypes(ChannelType.GuildNewsThread, ChannelType.GuildPrivateThread, ChannelType.GuildPublicThread)
                .setRequired(true)
        ),
    async execute(interaction) {
        const thread = interaction.options.getChannel('thread');

        console.log(thread);

        interaction.reply({ content: 'Check console for output.', ephemeral: true });
    },
};