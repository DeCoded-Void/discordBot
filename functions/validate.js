/**

    cxBot.js Mr. Prog Validation Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 08/26/18
    Date Last Updated: 10/07/18
    Last Update By: Th3_M4j0r

**/

// Load in Required Libraries and Files
const CustomErrors = require(`../classes/CustomErrors.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);


/**
 * 
 * @param {string} battleCode
 */
module.exports.validateBattleCode = (battleCode) => {
    // Debug to Console
    debug(`I am inside the Battlecode Validation System.`);

    if (battleCode.length !== 14) { // If Battle Code Length is Invalid...
        debug(`Battlecode fails validation at battleCode.length: `
            + `${battleCode.length}`);
        return false;
    } else { // If Battle Code Length is Valid...
        for (i = 0; i < battleCode.length; i++) {
            let code = battleCode.charCodeAt(i);
            if ((i === 4) || (i === 9)) { // Special Case for Dash Characters
                if (battleCode[i] !== '-') { // If Not Dash Character...
                    debug(`Battlecode fails validation at battleCode[${i}]: `
                        + `Expected character '-'. Found character ${battleCode[i]}.`);
                    return false;
                }
            } else if (!((code > 47) && code < 58) && !((code > 64) && (code < 70))) {
                // If Code is Out of Bounds...
                debug(`Battlecode fails validation at battleCode[${i}]: `
                    + `Character out of range. Found character ${code}.`);
                return false;
            } else {
                debug(`battleCode[${i}]: ${battleCode[i]} | code: ${code}`);
            }
        }
        debug(`Battlecode successfully passed validation.`);
        return true;
    }
}

/**
 * 
 * @param {object} role
 * @param {string} commandName
 * @returns {boolean}
 */
module.exports.role = (role, commandName) => {
    // Debug to Console
    debug(`I am inside the role validation system.`);

    if ((!role) || ((!role.ID) || (role.ID === ""))) {
        throw new CustomErrors.NoDefinedRole(commandName);
    }

    return true;
}

/**
 * 
 * @param {string} method
 * @returns {boolean}
 */
module.exports.methodType = (method) => {
    // Debug to Console
    debug(`I am inside the method validation system.`);

    if ((method !== "PLAYING") && (method !== "STREAMING") && (method !== "LISTENING") && (method !== "WATCHING")) {
        throw new CustomErrors.UnsupportedMethodType(method);
    }

    return true;
}
