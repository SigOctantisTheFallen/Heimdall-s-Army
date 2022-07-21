require('dotenv').config();
process.on("unhandledRejection", error =>
  console.error("Uncaught Promise Rejection", error)
);
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({ disableEveryone: true, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.mongoose = require('./utils/mongoose');

const token = process.env.TOKEN;
//This is the collection of commands.
["commands"].forEach(x => (client[x] = new Collection()));
//this is going to run all of the events and commands when told to execute
["command", "event"].forEach(x => require(`./handler/${x}`)(client));

client.mongoose.init();
client.login(token);
