const { Events, ActivityType } = require('discord.js');
const logger = require("../logging/logger.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger.info(`Discord bot went online. Username: ${client.user.tag}`);
        client.user.setPresence({
            activities: [
                {
                    name: `your suggestions.`,
                    type: ActivityType.Listening,
                },
            ],
            status: `dnd`,
        });
    },
};