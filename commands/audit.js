/**

    cxBot.js Mr. Prog audit log command
    Version: 1
    Author: Th3_M4j0r
    clearance: Mod+
    Default Enabled: Cannot be Disabled
    Date Started: 09/16/18
    Date Last Updated: 10/06/18
    Last Update By: Th3_M4j0r

**/



const Discord = require(`discord.js`);
const betterSql = require(`../classes/betterSql.js`);
const config = require(`../files/config.json`);
const { run: dmCheck } = require(`../functions/dmCheck.js`);
const { run: hasElevatedPermissions } = require(`../functions/hasElevatedPermissions.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);


//command Stuff
const command = {
    adminOnly: false,
    bigDescription: ("Use this command to see a page of the audit log, "
        + "can take a page number as an argument.\nReturns:\n\t " + config.returnsDM),
    description: "DMs you a page of the audit log",
    enabled: null,
    fullName: "Audit",
    name: "audit",
    permissionLevel: "mod"
}

/**
 * 
 * @param {Discord.GuildAuditLogsEntry} entry
 */
function format(entry) {

    if (entry.actionType == "DELETE") {
        return `\tTimestamp:${entry.createdAt.toString()}\n\tAction:${entry.action}`
            + `\n\tExecutor:${entry.executor.username}`;
    }
    else {
        return `\tTimestamp:${entry.createdAt.toString()}\n\tAction:${entry.action}`
            + `\n\tExecutor:${entry.executor.username}\n\tChanges:${JSON.stringify(entry.changes)}`;
    }
}

/**
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {betterSql} sql
 * */
module.exports.run = async (bot, message, args, sql) => {

    debug(`I am inside the ${command.fullName} command`);
    if (dmCheck(message, command.fullName)) return; //returns on DM channel 

    if (! await hasElevatedPermissions(bot, message, command.adminOnly, sql)) return;

    let startPos = 0;
    let page = 1;
    if (args[0] && !isNaN(args[0]) && args[0] > 0) { //valid page number?
        startPos = (args[0] - 1) * 5;
        page = args[0];
    }
    try {
        debug(`Fetching audit logs for ${message.guild.name}`);
        let audit = await message.guild.fetchAuditLogs();
        let entries = audit.entries.array();
        debug(`Attempting to Generate embed of entries ${startPos} through ${startPos + 4}`);
        let embed = {
            "title": `Page#${page}`,
            "color": config.auditColor,
            "fields": [
                {
                    "name": `Log#${startPos + 1}`,
                    "value": format(entries[startPos])
                },
                {
                    "name": `Log#${startPos + 2}`,
                    "value": format(entries[startPos + 1])
                },
                {
                    "name": `Log#${startPos + 3}`,
                    "value": format(entries[startPos + 2])
                },
                {
                    "name": `Log#${startPos + 4}`,
                    "value": format(entries[startPos + 3])
                },
                {
                    "name": `Log#${startPos + 5}`,
                    "value": format(entries[startPos + 4])
                }
            ]
        };
        message.author.send({ embed }).catch(error => {
            errorLog(error);
            message.channel.send(`I was unable to send the log to you, if this persists, inform ${config.about.author}\n`
                + `error type: ${error.toString()}`);
        });
    }
    catch (error) {
        errorLog(error);
    }
};

module.exports.help = command;