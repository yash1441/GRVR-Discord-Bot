const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
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
    data: new SlashCommandBuilder()
        .setName("rewards")
        .setDescription("Reward delivery system")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("send")
                .setDescription("Send rewards marked as ready in the table")
        ),
    async execute(interaction) {
        await interaction
            .reply({
                content: "Updating the list of rewards...",
                ephemeral: true,
            })
            .then(() => {
                logger.info(`Updating the list of rewards.`);
            });

        const tenantToken = await feishu.authorize(
            process.env.FEISHU_ID,
            process.env.FEISHU_SECRET
        );

        const rewardData = JSON.parse(
            await feishu.getRecords(
                tenantToken,
                serverData[interaction.guildId].rewardBase,
                serverData[interaction.guildId].rewardTable,
                `AND(CurrentValue.[Status] = "Ready")`
            )
        );

        logger.info(`Rewards Found: ${rewardData.data.total}`);

        if (!rewardData.data.total) {
            logger.info(`No rewards found.`);
            return await interaction.editReply({
                content: "No rewards found.",
                ephemeral: true,
            });
        }

        const failed = [];

        for (const record of rewardData.data.items) {
            let shouldContinue = false,
                message;
            const discordId = record.fields["Discord ID"];
            const rewardType = record.fields["Reward Type"];
            const rewardCurrency = record.fields["Currency"];
            const rewardValue = record.fields["Value"];
            let rewardCode = record.fields["Code"];
            const recordId = record.record_id;

            const member = await interaction.guild.members
                .fetch(discordId)
                .catch((error) => {
                    logger.error(discordId + " - " + error);
                    failed.push({ record_id: recordId, reason: "Member Not Found" });
                    shouldContinue = true;
                });

            if (shouldContinue) continue;

            if (rewardType == undefined) {
                failed.push({
                    record_id: recordId,
                    reason: "Reward Type Not Defined",
                });
                continue;
            }

            if (rewardCurrency == undefined) {
                failed.push({
                    record_id: recordId,
                    reason: "Currency Not Defined",
                });
                continue;
            }

            if (rewardValue == undefined) {
                failed.push({
                    record_id: recordId,
                    reason: "Value Not Defined",
                });
                continue;
            }

            message = `Congrats! You have been rewarded a ${rewardType} worth ${rewardValue} ${rewardCurrency}.\n\n${rewardCode}\n\nPlease tap **Claim** below to confirm.`;

            const claimButton = new ButtonBuilder()
                .setCustomId("claim" + recordId)
                .setLabel("Claim")
                .setStyle(ButtonStyle.Success)
                .setEmoji("✅");

            const claimRow = new ActionRowBuilder().addComponents(claimButton);

            let success = true;

            await member
                .send({
                    content: message,
                    components: [claimRow],
                })
                .catch((error) => {
                    logger.error(
                        `Failed to send message to ${discordId} for record ${recordId}.`
                    );
                    success = false;
                });

            if (success) {
                logger.info(`Sent message to ${discordId} for record ${recordId}.`);
                await feishu.updateRecord(
                    tenantToken,
                    serverData[interaction.guildId].rewardBase,
                    serverData[interaction.guildId].rewardTable,
                    recordId,
                    { fields: { Status: "Sent" } }
                );
            } else {
                logger.info(
                    `Sending message to ${discordId} failed. Creating private channel.`
                );

                const channel = await interaction.client.channels.cache.get(serverData[interaction.guildId].rewardChannel);
                await privateChannel(
                    interaction,
                    channel,
                    "Reward - " + member.user.username,
                    discordId,
                    `${member.user}\n` + message,
                    false,
                    [claimRow],
                    "**Once you click CLAIM, this thread would be DELETED.**\nPlease copy the reward/code somewhere and only then press the button."
                );
            }
        }

        if (failed.length > 0) {
            for (const record of failed) {
                await feishu.updateRecord(
                    tenantToken,
                    process.env.REWARD_BASE,
                    process.env.DELIVERY,
                    record.record_id,
                    { fields: { Status: "Failed", Reason: record.reason } }
                );
            }
        }

        await interaction.editReply({ content: "Done!", components: [] });
        logger.info(
            `Reward sending finished. ${rewardData.data.total} rewards sent. ${failed.length} failed.`
        );
    },
};