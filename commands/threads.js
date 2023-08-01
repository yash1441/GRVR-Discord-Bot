const { SlashCommandBuilder } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('threads')
		.setDescription('Get data from threads.')
        .addStringOption(option =>
            option.setName('thread-id')
                .setDescription('Enter the ID of thread'))
                .setRequired(true),
	async execute(interaction) {
        const threadId = interaction.options.getString('thread-id');
		const channel = interaction.client.channels.cache.get(process.env.VOTE_SUGGESTIONS_CHANNEL);
        const thread = channel.threads.cache.find(x => x.id === threadId);

        console.log(thread);

        interaction.reply({ content: 'Check console for output.', ephemeral: true });
	},
};