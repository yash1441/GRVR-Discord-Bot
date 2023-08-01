const { Events, ChannelType } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    name: Events.ThreadCreate,
    async execute(thread) {
        if (thread.parent.type != ChannelType.GuildForum || thread.parentId != process.env.VOTE_SUGGESTIONS_CHANNEL) return;

        const messages = await thread.messages.fetch();
        const message = messages.first()
    }
};