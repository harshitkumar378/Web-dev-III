"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const logger = require("./modules/logger");

const historyFile = path.join(__dirname, "test.txt");

function getRollCount(value) {
  const count = Number(value ?? 1);

  if (!Number.isSafeInteger(count) || count < 1 || count > 100) {
    throw new Error("Roll count must be a whole number from 1 to 100.");
  }

  return count;
}

function rollDice(count) {
  return Array.from({ length: count }, () => crypto.randomInt(1, 7));
}

function saveHistory(rolls) {
  const entry = `[${new Date().toISOString()}] Dice rolls: ${rolls.join(", ")}\n`;

  fs.appendFile(historyFile, entry, "utf8", (error) => {
    if (error) {
      logger.error(`[dice] Could not save roll history: ${error.message}`);
      process.exitCode = 1;
      return;
    }

    logger.success("[dice] Roll history saved to test.txt.");
  });
}

function main() {
  const [countInput, ...extraArguments] = process.argv.slice(2);

  try {
    if (extraArguments.length > 0) {
      throw new Error("Provide only one optional roll-count argument.");
    }

    const count = getRollCount(countInput);
    logger.log(`[dice] Generating ${count} secure dice roll${count === 1 ? "" : "s"}...`);
    const rolls = rollDice(count);
    rolls.forEach((value, index) => {
      const label = count === 1 ? "Dice Rolled" : `Dice Rolled ${index + 1}`;
      logger.success(`${label}: ${value}`);
    });
    saveHistory(rolls);
  } catch (error) {
    logger.error(`[dice] Input error: ${error.message}`);
    logger.warn("Usage: node dice.js [roll-count]");
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { getRollCount, rollDice, saveHistory };
