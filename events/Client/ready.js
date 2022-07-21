require('dotenv').config();
const Discord = require('discord.js');
const prefix = process.env.PREFIX;

module.exports = (client) => {
    console.log(`${client.user.username} is ready`);
}
