"use strict";

const isEven = require("./modules/isEven");
const logger = require("./modules/logger");

function main() {
  const [valueInput, ...extraArguments] = process.argv.slice(2);

  if (
    valueInput === undefined ||
    valueInput.trim() === "" ||
    extraArguments.length > 0 ||
    !Number.isInteger(Number(valueInput))
  ) {
    logger.error("Usage: node app.js <integer>");
    process.exitCode = 1;
    return;
  }

  const value = Number(valueInput);
  logger.log(`Checking ${value} with the reusable isEven module.`);
  logger.log(`${value} is ${isEven(value) ? "even" : "odd"}.`);
}

if (require.main === module) {
  main();
}
