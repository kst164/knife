const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const Keyv = require("keyv");
const express = require("express");

const app = express();

// To track uptime
app.get("/", (req, res) => {
  res.send("Hey its working yay!");
});

app.listen(3000, () => {
  console.log("Express is up and running");
});

const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILDS,
  ],
});
const keyv = new Keyv("sqlite://safe-from-knife.sqlite");

keyv.on("error", (err) => console.error("Keyv connection error:", err));

client.once("ready", () => {
  console.log("Ready!");
  /*
  // To get guildId
  client.guilds.fetch().then((guilds) => {
    console.log(guilds);
  });
  */

  /*
  // To get channelId
  let guild = client.guilds.resolve("909396900908785684");
  let guildName = guild.name;
  console.log("Guild: " + guildName);
  guild.channels
    .fetch()
    .then((channels) => {
      console.log(channels);
    })
    .catch(console.error);
  */
});

client.on("messageCreate", async (message) => {
  console.log("\nNew message");
  if (message.guildId !== "909396900908785684") {
    // Different server, don't care
    console.log("Wrong server");
    return;
  }

  if (message.author.bot) {
    // Message was posted by a bot, ignore it
    console.log("Bot message");
    return;
  }

  console.log(message.author.username + " to " + message.channel.name);
  if (message.channelId == "909710672357634068") {
    // The user has given an intro
    console.log("Gave intro, saving");
    await keyv.set(message.author.id, true);
    return;
  }

  console.log("Not intro");

  await keyv.set("1", true);
  keyv.get(message.author.id).then((has_introed) => {
    if (!has_introed) {
      console.log("Hasn't introed, knife time");
      message.react("🔪").catch(console.error);
    }
  });
});

client.login(token);

