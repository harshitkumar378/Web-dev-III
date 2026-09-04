"use strict";

const logger = require("./modules/logger");

const supportedOperations = new Map([
  ["add", (firstNumber, secondNumber) => firstNumber + secondNumber],
  ["subtract", (firstNumber, secondNumber) => firstNumber - secondNumber],
  ["multiply", (firstNumber, secondNumber) => firstNumber * secondNumber],
  ["divide", (firstNumber, secondNumber) => firstNumber / secondNumber],
  ["modulus", (firstNumber, secondNumber) => firstNumber % secondNumber],
  ["power", (firstNumber, secondNumber) => firstNumber ** secondNumber],
  ["average", (firstNumber, secondNumber) => (firstNumber + secondNumber) / 2],
]);

function parseNumber(value, name) {
  if (value === undefined || value.trim() === "" || !Number.isFinite(Number(value))) {
    throw new Error(`${name} must be a valid number.`);
  }

  return Number(value);
}

function calculate(operation, firstNumber, secondNumber) {
  const calculatorOperation = supportedOperations.get(operation);

  if (!calculatorOperation) {
    throw new Error(
      `Unsupported operation "${operation}". Use add, subtract, multiply, divide, modulus, power, or average.`,
    );
  }

  if ((operation === "divide" || operation === "modulus") && secondNumber === 0) {
    throw new Error(`${operation === "divide" ? "Division" : "Modulus"} by zero is not allowed.`);
  }

  return calculatorOperation(firstNumber, secondNumber);
}

function showUsage() {
  logger.warn(
    "Usage: node calculator.js <add|subtract|multiply|divide|modulus|power|average> <number1> <number2>",
  );
}

function main() {
  const [operation, firstInput, secondInput, ...extraArguments] = process.argv.slice(2);

  try {
    if (!operation || extraArguments.length > 0) {
      throw new Error("Please provide one operation and exactly two numbers.");
    }

    logger.log(`[calculator] Received inputs: ${process.argv.slice(2).join(" ")}`);
    const firstNumber = parseNumber(firstInput, "The first value");
    const secondNumber = parseNumber(secondInput, "The second value");
    const result = calculate(operation.toLowerCase(), firstNumber, secondNumber);

    logger.success(`Result: ${result}`);
  } catch (error) {
    logger.error(`Calculator error: ${error.message}`);
    showUsage();
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { calculate, parseNumber };
