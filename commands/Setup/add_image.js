const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const Team = require('../../models/team');
const User = require('../../models/user');

module.exports = {
    category: "Setup",
    data: new SlashCommandBuilder()
        .setName('add_image')
        .setDescription('Add an image to your robot (Maximum 3 images).')
        .addStringOption(option => option
            .setName('image_url')
            .setDescription('The url of the image you want to add. Please make sure the link is publicly available.')
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
        let img_arr = dbquery_teams.images;
        let img_cnt = dbquery_teams.imageCount;
        if(img_cnt >= 3) {
            return interaction.reply({
                content: 'Your team has already added the maximum number of images. Please use `remove_images` to remove them and start over.',
                ephemeral: true
            });
        }
        const img = interaction.options.getString('image_url');
        img_cnt = img_arr.push(img);
        await dbquery_teams.updateOne({
            imageCount: img_cnt,
            images: img_arr
        })
        .then(() => {
            interaction.reply({
                content: 'The image was successfully added.',
                ephemeral: true
            });
        })
    }
};