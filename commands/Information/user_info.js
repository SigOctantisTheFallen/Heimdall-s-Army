const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../models/user');

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('user_info')
        .setDescription('Check your user information'),
    async execute(client, interaction) {
        const dbquery_users = await User.findOne({ userID: interaction.member.id }).exec();
        if (!dbquery_users) {
            return interaction.reply({
                content: 'You are not registered as a user. Please use \`user_register\` to register.',
                ephemeral: true
            });
        }
        let embed = new MessageEmbed()
            .setTitle('User Information')
            .addFields([
                { name: 'Team ID', value: dbquery_users.teamID ? dbquery_users.teamID : 'Not in a team.' },
                { name: 'Participant Name', value: dbquery_users.participantName }
            ]);
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};