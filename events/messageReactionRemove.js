const { Events, Partials } = require('discord.js');
const logger = require('../logging/logger.js');
const feishu = require('../utils/feishu.js');

module.exports = {
    name: Events.MessageReactionRemove,
    async execute(reaction, user) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                logger.error('Something went wrong when fetching the message:');
                console.error(error);
                return;
            }
        }

        if (user.id == process.env.BOT_ID) return;

        if (reaction.emoji.name != '🔼' || reaction.emoji.name != '🔽') return;

        if (reaction.message.channelId != process.env.VOTE_SUGGESTIONS_CHANNEL) return;

        const upCount = reaction.message.reactions.cache.get('🔼').count - 1;
        const downCount = reaction.message.reactions.cache.get('🔽').count - 1;

        const data = {
            fields: {
                "🔼": upCount,
                "🔽": downCount
            }
        }

        const tenantToken = await feishu.authorize(
			process.env.FEISHU_ID,
			process.env.FEISHU_SECRET
		);

        await feishu.createRecord(
			tenantToken,
			"NeVObULOOaraZasdu4Iccix8n5b",
			"tbleOFyvlqnVOcOu",
			data
		);
    }
};