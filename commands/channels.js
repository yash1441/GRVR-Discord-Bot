const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channels')
        .setDescription('Get data from channels.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        console.log(channel);

        interaction.reply({ content: 'Check console for output.', ephemeral: true });
    },
};