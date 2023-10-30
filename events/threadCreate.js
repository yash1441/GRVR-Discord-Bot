const { Events, ChannelType } = require('discord.js');
const logger = require('../logging/logger.js');
const feishu = require('../utils/feishu.js');

module.exports = {
    name: Events.ThreadCreate,
    async execute(thread) {
        let votesChannel, bitableBase, bitableTable;

        switch (thread.guildId) {
            case process.env.GRVR_ID:
                votesChannel = process.env.GRVR_VOTE;
                bitableBase = process.env.GRVR_BASE;
                bitableTable = process.env.GRVR_TABLE;
                break;
            case process.env.LIGHT_ID:
                votesChannel = process.env.LIGHT_VOTE;
                bitableBase = process.env.LIGHT_BASE;
                bitableTable = process.env.LIGHT_TABLE;
                break;
        }

        if (thread.parent.type != ChannelType.GuildForum || thread.parentId != votesChannel) return;

        const channel = thread.client.channels.cache.get(votesChannel);
        const availableTags = channel.availableTags;

        const messages = await thread.messages.fetch();
        const message = await messages.first()

        const embed = await message.embeds[0];

        await message.react('🔼').then(() => message.react('🔽'));

        let category;

        for (const tag of availableTags) {
            if (tag.id == thread.appliedTags[0]) {
                category = tag.name;
                break;
            }
        }

        const data = {
            fields: {
                "Suggestion": embed.description,
                "Category": category,
                "🔼": 0,
                "🔽": 0,
                "Discord ID": embed.footer.text,
                "Discord Name": embed.author.name,
            },
        };

        const tenantToken = await feishu.authorize(
            process.env.FEISHU_ID,
            process.env.FEISHU_SECRET
        );

        await feishu.createRecord(
            tenantToken,
            bitableBase,
            bitableTable,
            data
        );
    }
};