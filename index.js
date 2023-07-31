const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    Events,
    ComponentType,
    ChannelType,
    ActionRowBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    AttachmentBuilder,
} = require("discord.js");
const logger = require("./logging/logger.js");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

let files = fs.readdirSync("./"),
    file;

for (file of files) {
    if (file.startsWith("autoAdd")) {
        require("./" + file);
    }
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, c => {
	logger.info(`Discord bot went online. Username: ${client.user.tag}`);
    client.user.setPresence({
        activities: [
            {
                name: `Gravity Royale VR`,
                type: ActivityType.Playing,
            },
        ],
        status: `dnd`,
    });
});

client.login(process.env.BOT_TOKEN);