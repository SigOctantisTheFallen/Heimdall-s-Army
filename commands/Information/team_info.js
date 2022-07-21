const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Team = require('../../models/team');
const User = require('../../models/user');

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('team_info')
        .setDescription('Check your team information'),
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
        const embedArray = [];
        const dbquery_teams = await Team.findOne({ teamID: dbquery_users.teamID }).exec();
        let memberMentions = ``;
        for (var i = 0; i < dbquery_teams.strength; i++) {
            memberMentions += `<@${dbquery_teams.memberInfo[i].discordID}> `;
        }
        let textEmbed = new MessageEmbed()
            .setTitle('Team Information')
            .addFields([
                { name: 'Team ID', value: dbquery_teams.teamID },
                { name: 'Team Name', value: dbquery_teams.teamName},
                { name: 'Members', value: memberMentions },
                { name: 'Robot Description', value: dbquery_teams.description }
            ]);
        embedArray.push(textEmbed);
        for (var i = 0; i < dbquery_teams.imageCount; i++) {
            let imageEmbed = new MessageEmbed()
                .setImage(dbquery_teams.images[i]);
            embedArray.push(imageEmbed);
        }
        interaction.reply({
            embeds: embedArray,
            ephemeral: true
        })
    }
};