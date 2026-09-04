"use strict";

const colors = Object.freeze({
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
});

function timestamp() {
  return new Date().toISOString();
}

function colorize(message, color) {
  return `${color}${message}${colors.reset}`;
}

function log(message, color = colors.cyan) {
  console.log(colorize(`[${timestamp()}] ${message}`, color));
}

function success(message) {
  console.log(colorize(message, colors.green));
}

function warn(message) {
  console.log(colorize(message, colors.yellow));
}

function error(message) {
  console.error(colorize(`[${timestamp()}] ${message}`, colors.red));
}

module.exports = { colors, colorize, log, success, warn, error };
