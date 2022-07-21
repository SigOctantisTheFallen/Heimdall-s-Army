const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const Team = require('../../models/team');
const User = require('../../models/user');

module.exports = {
    category: "Setup",
    data: new SlashCommandBuilder()
        .setName('remove_images')
        .setDescription('Remove all images associated with your bot for a fresh start.'),
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
        await dbquery_teams.updateOne({
            imageCount: 0,
            images: []
        })
        .then(() => {
            interaction.reply({
                content: 'The images were successfully removed.',
                ephemeral: true
            });
        })
    }
};