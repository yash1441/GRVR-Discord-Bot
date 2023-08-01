const { Events, ChannelType } = require('discord.js');
const logger = require('../logging/logger.js');
const feishu = require('../utils/feishu.js');

const TAGS = {
    "Category 1": process.env.CATEGORY_1,
    "Category 2": process.env.CATEGORY_2,
    "Category 3": process.env.CATEGORY_3
}

module.exports = {
    name: Events.ThreadCreate,
    async execute(thread) {
        if (thread.parent.type != ChannelType.GuildForum || thread.parentId != process.env.VOTE_SUGGESTIONS_CHANNEL) return;

        const messages = await thread.messages.fetch();
        const message = messages.first()

        const embed = message.embeds[0];

        await message.react('🔼').then(() => message.react('🔽'));

        const data = {
			fields: {
				"Suggestion": embed.description,
				"🔼": 0,
				"🔽": 0,
                "Discord ID": embed.footer.text,
                "Discord Name": embed.author.name,
			},
		};

        data.category = Object.keys(TAGS).find(categoryName => TAGS[categoryName] === thread.appliedTags[0]);

        console.log(data.category);

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