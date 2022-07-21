require('dotenv').config();
const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (client) => {
    const CLIENT_ID = process.env.CLIENT_ID;
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    const commandJSON = [];
    const load = dirs => {
        const commands = readdirSync(`./commands/${dirs}`).filter(d => d.endsWith('.js'));
        for (let file of commands) {
            const cmd = require(`../commands/${dirs}/${file}`);
            client.commands.set(cmd.data.name, cmd);
            commandJSON.push(cmd.data.toJSON());
        }
    }
    ["General", "Information", "Registration", "Setup"].forEach(x => load(x));
    (async () => {
        try {

            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, process.env.TEST_GUILD_ID), {
                body: commandJSON
            },
            );
            console.log('Successfully registered application commands for development guild');
        } catch (error) {
            if (error) console.error(error);
        }
    })();
}