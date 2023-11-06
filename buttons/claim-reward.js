const { ChannelType } = require('discord.js');
const feishu = require('../utils/feishu.js');
const logger = require("../logging/logger.js");

const serverData = {
    "1128162209764216934": {
        rewardBase: process.env.GRVR_REWARD_BASE,
        rewardTable: process.env.GRVR_REWARD_TABLE,
        rewardChannel: process.env.GRVR_REWARD_CHANNEL,
    },
    "1166259931335360542": {
        rewardBase: process.env.LIGHT_REWARD_BASE,
        rewardTable: process.env.LIGHT_REWARD_TABLE,
        rewardChannel: process.env.LIGHT_REWARD_CHANNEL,
    }
}

module.exports = {
    data: {
        name: 'claim-reward'
    },
    async execute(interaction) {
        await interaction.deferReply();

        const match1 = interaction.message.content.match(/\*Reference ID: (.*?)\*/);
        const match2 = interaction.message.content.match(/\*Server ID: (.*?)\*/);

        let recordId, serverId;

        if (match1 && match1[1]) {
            recordId = match1[1];
        } else {
            logger.error("Record ID not found.");
            return interaction.editReply({
                content: "Record ID: NULL",
            });
        }

        if (match2 && match2[1]) {
            serverId = match2[1];
        } else {
            logger.error("Server ID not found.");
            return interaction.editReply({
                content: "Server ID: NULL",
            });
        }

        const tenantToken = await feishu.authorize(
            process.env.FEISHU_ID,
            process.env.FEISHU_SECRET
        );

        await feishu.updateRecord(
            tenantToken,
            serverData[serverId].rewardBase,
            serverData[serverId].rewardTable,
            recordId,
            { fields: { Status: "Claimed" } }
        );

        if (interaction.channel.type != ChannelType.DM) {
            const thread = interaction.channel;
            await thread.members.remove(interaction.user.id);
            await thread.setArchived(true);
            await client.channels
                .fetch(serverData[serverId].rewardChannel)
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
        });
    },
};