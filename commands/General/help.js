const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  category: "General",
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all commands or find info about a specific command.')
    .addStringOption(option => option.setName('command').setDescription('The command you need help for (optional)').setRequired(false)),
  async execute(client, interaction) {
    const embed = new MessageEmbed();
    embed.setColor(0xc95bbd);
    embed.setAuthor({ name: `${interaction.guild.me.displayName}'s Help` });
    embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    const query = interaction.options.getString("command");
    if (!query) {
      const categories = readdirSync(`./commands/`);
      embed.setDescription(`**These are the available commands for ${interaction.guild.me.displayName}**`);
      embed.setFooter({ text: "Use the donate command to support Johanette.", iconURL: client.user.displayAvatarURL({ dynamic: true }) });

      categories.forEach(category => {
        const dir = client.commands.filter(c => c.category === category);
        const capitalise =
          category.slice(0, 1).toUpperCase() + category.slice(1);
        try {
          if (["Dev"].indexOf(capitalise) == -1) {
            embed.addField(
              `> ${capitalise} [${dir.size}]:`,
              dir.map(c => `\`${c.data.name}\``).join(" | ")
            );
          }
        } catch (e) {
          console.error(e);
        }
      });
      return interaction.reply({ embeds: [embed] });
    }
    else {
      let command = client.commands.get(query.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));
      if (!command)
        return interaction.reply({
          embeds: [
            embed
              .setTitle("Invalid Command")
              .setDescription(`Use \`\/help\` for a list of commands.`)
          ]
        });
      embed.addField(`> **Command: **`, command.data.name.slice(0, 1).toUpperCase() + command.data.name.slice(1));
      embed.addField(`> **Description: **`, command.data.description || "No Description Provided");
      return interaction.reply({ embeds: [embed] });
    }
  }
};