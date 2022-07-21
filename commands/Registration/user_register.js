const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const User = require('../../models/user');

module.exports = {
    category: "Registration",
    data: new SlashCommandBuilder()
        .setName('user_register')
        .setDescription('Register as a user.')
        .addStringOption(option => option
            .setName('Participant_Name')
            .setDescription('Your name (This cannot be changed later)')
            .setRequired(true)),
    async execute(client, interaction) {
        const dbquery_users = await User.findOne({ userID: interaction.member.id }).exec();
        if (dbquery_users) {
            return interaction.reply({
                content: 'You have already registered as a user.',
                ephemeral: true
            });
        }
        const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            userID: interaction.member.id,
            participantName: interaction.options.getString('Participant_Name')
        });
        await newUser.save().catch(e => console.error(e));
        interaction.reply({
            content: 'You have been successfully registered as a user. Please use `team_register` to register for a team.',
            ephemeral: true
        });
    }
};