"use strict";

/**
 * Returns true only when value is an integer divisible by two.
 * @param {number} value
 * @returns {boolean}
 */
function isEven(value) {
  return Number.isInteger(value) && value % 2 === 0;
}

module.exports = isEven;
