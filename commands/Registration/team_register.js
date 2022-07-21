const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const Team = require('../../models/team');
const User = require('../../models/user');

module.exports = {
    category: "Registration",
    data: new SlashCommandBuilder()
        .setName('team_register')
        .setDescription('Register your team for the event.')
        .addStringOption(option => option
            .setName('team_id')
            .setDescription('The ID of the team you would like to register as a participant of. Leave blank to create a new team')
            .setRequired(false)),
    async execute(client, interaction) {
        let dbquery_users = await User.findOne({ userID: interaction.member.id }).exec();
        if (!dbquery_users) {
            return interaction.reply({
                content: 'You are not registered as a user yet.\nPlease use \`user_register\` to register as a user before registering as a team.',
                ephemeral: true
            });
        }
        if (dbquery_users.teamID) {
            return interaction.reply({
                content: 'You are already registered as a member of a team.',
                ephemeral: true
            })
        }
        let participant_name = dbquery_users.participantName;
        const team_ID = interaction.options.getString('Team_ID');
        if (team_ID) {
            let dbquery_teams = await Team.findOne({ teamID: team_ID }).exec();
            if (!dbquery_teams) {
                return interaction.reply({
                    content: 'No team exists with that ID.\n You can register as a new team by leaving the ID field blank or ask your teammates to give you the team ID.\nThe \`team_info\` command can be used by members of a team to check the team ID.\nTeam IDs are randomly generated.',
                    ephemeral: true
                });
            }
            let strength = dbquery_teams.strength;
            let members = dbquery_teams.memberInfo;
            if (strength >= 10) {
                return interaction.reply({
                    content: 'The team already has the maximum number of members',
                    ephemeral: true
                });
            }
            let newMemberInfo = { discordID: interaction.member.id, participantName: participant_name };
            strength = members.push(newMemberInfo);
            await dbquery_teams.updateOne({
                strength: strength,
                memberInfo: members
            })
                .then(() => {
                    console.log("Member pushed to team.");
                });
            await dbquery_users.updateOne({
                teamID: team_ID
            })
                .then(() => {
                    interaction.reply({
                        content: `You have successfully been registered as a member of team \`${team_ID}\``,
                        ephemeral: true
                    });
                })
        }
        var new_team_ID, dbquery_teams;
        do {
            new_team_ID = Math.random().toString(36).substring(2, 7);
            dbquery_teams = await Team.findOne({ teamID: new_team_ID }).exec();
        } while (dbquery_teams || dbquery_teams.teamID != new_team_ID);
        const newTeam = new Team({
            _id: mongoose.Types.ObjectId(),
            teamID: new_team_ID,
            strength: 1,
            memberInfo: [{ discordID: interaction.member.id, participantName: participant_name }],
            description: 'Generic team description',
            imageCount: 0,
            images: []
        });
        await newTeam.save().catch(e => console.error(e));
        await dbquery_users.updateOne({
            teamID: new_team_ID
        })
            .then(() => {
                interaction.reply({
                    content: `You have successfully been registered as a member of team \`${new_team_ID}\``,
                    ephemeral: true
                });
            })
    }
};
