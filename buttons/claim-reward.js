const { EmbedBuilder, userMention } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    data: {
        name: 'claim-reward'
    },
    async execute(interaction) {
        await interaction.deferReply();

        const regex = /\*Reference ID: (.*?)\*/;
        const match = interaction.message.content.match(regex);

        if (match && match[1]) {
            const recordId = match[1];
            return interaction.editReply({
                content: "Record ID: " + recordId,
            });
        } else {
            logger.error("Record ID not found.");
            return interaction.editReply({
                content: "Record ID: NULL",
            });
        }

        /*const recordId = interaction.customId.substring(5);

        const tenantToken = await feishu.authorize(
            process.env.FEISHU_ID,
            process.env.FEISHU_SECRET
        );

        await feishu.updateRecord(
            tenantToken,
            process.env.REWARD_BASE,
            process.env.DELIVERY,
            recordId,
            { fields: { Status: "Claimed" } }
        );

        if (interaction.channel.type != ChannelType.DM) {
            const thread = interaction.channel;
            await thread.members.remove(interaction.user.id);
            await thread.setArchived(true);
            await client.channels
                .fetch(process.env.COLLECT_REWARDS_CHANNEL)
                .then((channel) => {
                    channel.permissionOverwrites.delete(
                        interaction.user,
                        "Claimed Reward"
                    );
                });
        }

        await interaction.editReply({
            content: "Your reward has been marked as **Claimed**.",
        });

        await interaction.message.edit({
            content: interaction.message.content,
            components: [],
        });*/
    },
};