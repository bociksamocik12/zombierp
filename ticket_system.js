const {
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Modal,
    TextInputComponent,
  } = require("discord.js");
  const settings = require("./settings");
  
  /**
   *
   * @param {Client} client
   */
  module.exports = async (client) => {
    // code
  
    client.on("interactionCreate", async (interaction) => {
      if (interaction.isCommand()) {
        if (interaction.commandName == "ping") {
          return interaction.reply({
            content: `> Pong :: ${client.ws.ping}`,
          });
        } else if (interaction.commandName == "podaniewl") {
          // code
          let ticketChannel = interaction.guild.channels.cache.get(
            settings.ticketChannel
          );
          if (!ticketChannel) return;
  
          let embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`🛡️Podanie na whiteliste🛡️`);
  
          let btnrow = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId("ticket_create")
              .setStyle("SECONDARY")
              .setLabel(`Podanie na whiteliste`)
              .setEmoji("🛡️"),
          ]);
          await ticketChannel.send({
            embeds: [embed],
            components: [btnrow],
          });
  
          interaction.reply({
            content: `Panel stworzony na ${ticketChannel}`,
          });
        }
      }
  
      if (interaction.isButton()) {
        if (interaction.customId == "ticket_create") {
          const tickets_modal = new Modal()
            .setTitle("Podanie Whitelist")
            .setCustomId("tickets_modal");
  
          const user_name = new TextInputComponent()
            .setCustomId("ticket_username")
            .setLabel(`NICK MINECRAFT ORAZ KRÓRKI OPIS POSTACI`.substring(0, 45))
            .setMinLength(100)
            .setMaxLength(500)
            .setRequired(true)
            .setStyle("PARAGRAPH")
  
          const user_reason = new TextInputComponent()
            .setCustomId("ticket_reason")
            .setLabel(`CO WNIESIE TWOJA POSTAC I KIM CHCE ZOSTAC`.substring(0, 45))
            .setMinLength(300)
            .setMaxLength(750)
            .setRequired(true)
            .setStyle("PARAGRAPH");

          const user_nie = new TextInputComponent()
            .setCustomId("ticket_nie")
            .setLabel(`OPISZ AKCE RP Z UDZIALEM TWOJEJ POSTACI`.substring(0, 45))
            .setMinLength(300)
            .setMaxLength(750)
            .setRequired(true)
            .setStyle("PARAGRAPH");

          const user_tak = new TextInputComponent()
            .setCustomId("ticket_tak")
            .setLabel(`OPISZ CO TO JEST ROLEPLAY`.substring(0, 45))
            .setMinLength(50)
            .setMaxLength(500)
            .setRequired(true)
            .setStyle("PARAGRAPH");

  
          const row_username = new MessageActionRow().addComponents(user_name);
          const row_user_reason = new MessageActionRow().addComponents(
            user_reason);
          const row_user_nie = new MessageActionRow().addComponents(user_nie);
          const row_user_tak = new MessageActionRow().addComponents(user_tak);
          tickets_modal.addComponents(row_username, row_user_reason, row_user_nie, row_user_tak);
  
          await interaction.showModal(tickets_modal);
        } else if (interaction.customId == "ticket_delete") {
          let ticketname = `podanie-${interaction.user.id}`;
          let oldChannel = interaction.guild.channels.cache.find(
            (ch) => ch.name == ticketname
          );
          
          client.channels.cache.get(`989355137531277333`).send(`❌${interaction.member} Twoje podanie na WL zostalo odrzucone!`)
          if (!oldChannel) return;
          interaction.reply({
            content: `> Zostanie usuniety za chwile`,
          });
          setTimeout(() => {
            oldChannel.delete().catch((e) => {});
          }, 5000);

          
        } else if (interaction.customId == "ticket_acept") {
          let ticketname = `podanie-${interaction.user.id}`;
          let oldChannel = interaction.guild.channels.cache.find(
            (ch) => ch.name == ticketname
          );
          
          client.channels.cache.get(`989355137531277333`).send(`✅${interaction.member} Twoje podanie na WL zostalo pomyslnie przyjete!`)
          if (!oldChannel) return;
          interaction.reply({
            content: `> Zostanie usuniety za chwile`,
          });
          setTimeout(() => {
            oldChannel.delete().catch((e) => {});
          }, 5000);  
        }
      }
  
      if (interaction.isModalSubmit()) {
        const ticket_username =
          interaction.fields.getTextInputValue("ticket_username");
        const ticket_user_reason =
          interaction.fields.getTextInputValue("ticket_reason");
        const ticket_user_nie =
          interaction.fields.getTextInputValue("ticket_nie");
         const ticket_user_tak =
          interaction.fields.getTextInputValue("ticket_tak");
  
        let ticketname = `podanie-${interaction.user.id}`;
        await interaction.guild.channels
          .create(ticketname, {
            type: "GUILD_TEXT",
            topic: `podanie-${interaction.user.tag}`,
            parent: settings.ticketCategory || interaction.channel.parentId,
            permissionOverwrites: [
              {
                id: interaction.guildId,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: interaction.user.id,
                allow: [
                  "VIEW_CHANNEL",
                  "SEND_MESSAGES",
                  "READ_MESSAGE_HISTORY",
                  "EMBED_LINKS",
                  "ATTACH_FILES",
                  "MANAGE_CHANNELS",
                  "ADD_REACTIONS",
                  "USE_APPLICATION_COMMANDS",
                ],
              },
              {
                id: client.user.id,
                allow: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
              },
            ],
          })
          .then(async (ch) => {
            let embed = new MessageEmbed()
              .setColor("BLURPLE")
              .setTitle(`Podanie od ${interaction.user.username}`)
              .addFields([
                {
                  name: `NICK MINECRAFT ORAZ KRÓRKI OPIS POSTACI`,
                  value: `> ${ticket_username}`,
                },
                {
                  name: `CO WNIESIE TWOJA POSTAC I KIM CHCE ZOSTAC`,
                  value: `> ${ticket_user_reason}`,
                },
                {
                  name: `OPISZ AKCE RP Z UDZIALEM TWOJEJ POSTACI`,
                  value: `> ${ticket_user_nie}`
                },
                {
                  name: `OPISZ CO TO JEST ROLEPLAY`,
                  value: `> ${ticket_user_tak}`
                },
              ]);
  
            let btnrow = new MessageActionRow().addComponents([
              new MessageButton()
                .setCustomId(`ticket_delete`)
                .setStyle("DANGER")
                .setLabel(`Odrzuc`),
            ]); 

            let accept = new MessageActionRow().addComponents([
              new MessageButton()
                .setCustomId(`ticket_acept`)
                 .setStyle("SUCCESS")
                .setLabel(`Zakceptuj`),
            ]);    
            ch.send({
              content: `${interaction.member} || ${settings.ticketRoles.map(
                (r) => `<@&${r}>`
              )}`,
              embeds: [embed],
              components: [ btnrow, accept ],
            });
            interaction.reply({
              content: `> Twoje podanie zostalo przeslane do administracji`,
              ephemeral: true,
            });
          })
          .catch((e) => {
            interaction.reply({
              content: `Error \n \`${e.message}\``,
              ephemeral: true,
            });
          });
      }
    });
  };
  