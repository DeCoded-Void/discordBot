/*
    Command Name: eval
    Function: Allows code to be run through the bot
    Clearance: Owner Only
  	Default Enabled: Disable
    Date Created: 10/17/17
    Last Updated: 09/15/18
    Last Update By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const fs = require(`fs`);
const sqlite = require(`sqlite`);
const channels = require(`../files/channels.json`);
const config = require(`../files/config.json`);
const includedCommands = require(`../files/includedCommands.json`);
const roles = require(`../files/roles.json`);
const userids = require(`../files/userids.json`);
const disabledCommand = require(`../functions/disabledCommand.js`);
const log = require(`../functions/log.js`);

// Command Variables
const ownerID = userids.ownerID;
const command = {
    bigDescription: ("OWNER ONLY. ALL ACCESS COMMAND."),
    description: "OWNER ONLY. ALL ACCESS COMMAND.",
    enabled: false,
    fullName: "Eval",
    name: "eval",
    permissionLevel: "owner"
}

/**
 *
 * @param {any} text
 */
function clean(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`"
            + String.fromCharCode(8203)).replace(/@/g, "@"
                + String.fromCharCode(8203));
    else {
        return text;
    }
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {sqlite} sql
 */
module.exports.run = async (bot, message, args, sql) => {
    // Debug to Console
    log.debug(`I am inside the ${command.fullName} command.`);

    // Owner ID Check
    if (message.author.id !== userids.ownerID) {
        let reply = (`WARNING. ATTEMPTED USE OF EVAL COMMAND BY `
            + `**${message.author.username}**`);
        log.debug(reply);
        console.log(reply);
        return bot.users.get(userids.ownerID).send(reply).catch(error => {
            log.error(reply);
            log.error(error);
        });
    } else {
        // Enabled Command Test
        if (!command.enabled) {
            return disabledCommand.run(command.fullName, message);
        } else {
            try {
                const code = args.join(" ");
                let evaled = await eval(code);
                if (typeof evaled !== "string") {
                    evaled = require("util").inspect(evaled);
                }
                message.channel.send(clean(evaled), { code: "xl" });
            }
            catch (error) {
                try {
                    message.channel.send(`\`ERROR:\` \`\`\`xl\n${clean(error)}\n\`\`\``)
                    log.error(error);
                }
                catch (error) {
                    message.channel.send(`\`ERROR UNABLE TO SEND ERROR MESSAGE DUE TO `
                        + `CHARACTER RESTRICTION. ERROR HAS BEEN LOGGED.\``);
                    errorLog.run(error);
                }
            }
        }
    }
    // ALWAYS MAKE IT RESET OWNER ID.
    return userids.ownerID = ownerID;
}

module.exports.help = command;
