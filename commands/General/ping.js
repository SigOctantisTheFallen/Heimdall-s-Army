const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test the latency of the bot.'),
    async execute(client, interaction) {
        await interaction.deferReply();
        interaction.fetchReply().then(reply => {
            interaction.editReply(`Pong! Response took ${reply.createdTimestamp - interaction.createdTimestamp} ms! Heartbeat is ${client.ws.ping.toFixed(0)} ms!`);
        })
    }
};