const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const Team = require('../../models/team');
const User = require('../../models/user');

module.exports = {
    category: "Setup",
    data: new SlashCommandBuilder()
        .setName('set_description')
        .setDescription('Change the description of your bot (maximum of 2000 characters)')
        .addStringOption(option => option
            .setName('description')
            .setDescription('The description for your bot. Please use \\n for line breaks.')
            .setRequired(true)),
    async execute(client, interaction) {
        const dbquery_users = await User.findOne({ userID: interaction.member.id }).exec();
        if (!dbquery_users) {
            return interaction.reply({
                content: 'You are not registered as a user. Please use \`user_register\` to register.',
                ephemeral: true
            });
        }
        if (!dbquery_users.teamID) {
            return interaction.reply({
                content: 'You are not a member of any team. Please use \`team_register\` to join a team.',
                ephemeral: true
            })
        }
        const dbquery_teams = await Team.findOne({ teamID: dbquery_users.teamID }).exec();
        const desc = interaction.options.getString('description').replace('\\n', '\n');
        await dbquery_teams.updateOne({
            description: desc
        })
            .then(() => {
                interaction.reply({
                    content: `Your robot description has been set to \`${desc}\``,
                    ephemeral: true
                });
            })
    }
};