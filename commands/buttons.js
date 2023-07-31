const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const logger = require("../logging/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buttons")
        .setDescription("Sets up embed and buttons for respective actions")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("suggestions")
                .setDescription("Setups up Suggestions Channel")
        ),
    async execute(interaction) {
        await interaction.deferReply();

        if (interaction.user.id != process.env.MY_ID) {
            interaction.deleteReply();
            return;
        }

        const subCommand = interaction.options.getSubcommand();

        if (subCommand === "suggestions") {
            const button = new ButtonBuilder()
                .setCustomId("suggestion-submit")
                .setLabel("Submit Suggestion")
                .setStyle(ButtonStyle.Success)
                .setEmoji("📝");

            const embed = new EmbedBuilder()
                .setTitle(`FEEDBACK HELP US IMPROVE THE GAME!`)
                .setDescription(
                    `This is the channel where you submit the suggestions!\nOnce approved, suggestions will be shared in <#${process.env.VOTE_SUGGESTIONS_CHANNEL}> for public voting!`
                )
                .setColor(process.env.THEME_COLOR);

            const row = new ActionRowBuilder().addComponents([button]);

            interaction.channel.send({ embeds: [embed], components: [row] }).then(() => interaction.deleteReply()).catch((error) => {
                logger.error(error);
                interaction.reply({ content: 'There was an error!' });
            });
        }
    },
};