const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Team = require('../../models/team');
const User = require('../../models/user');

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('check_info')
        .setDescription('Check the team information of another user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Ping the user whose team information you want to check.')
            .setRequired(true)),
    async execute(client, interaction) {
        const target = interaction.options.getMember('user');
        const dbquery_users = await User.findOne({ userID: target.id }).exec();
        if (!dbquery_users) {
            return interaction.reply({
                content: 'That person is not registered as a user.',
                ephemeral: true
            });
        }
        if (!dbquery_users.teamID) {
            return interaction.reply({
                content: 'That member is not a part of any team.',
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