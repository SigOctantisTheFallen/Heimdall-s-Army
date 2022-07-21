const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const Team = require('../../models/team');
const User = require('../../models/user');

module.exports = {
    category: "Setup",
    data: new SlashCommandBuilder()
        .setName('set_name')
        .setDescription('Change the team name of your bot (maximum of 50 characters)')
        .addStringOption(option => option
            .setName('team_name')
            .setDescription('The team name for your bot.')
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
        const name = interaction.options.getString('team_name').substring(0,50);
        await dbquery_teams.updateOne({
            teamName: name
        })
            .then(() => {
                interaction.reply({
                    content: `Your team name has been set to \`${name}\``,
                    ephemeral: true
                });
            })
    }
};