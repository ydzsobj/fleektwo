"use strict";

exports.__esModule = true;
exports.isNumber = isNumber;
exports.isNaN = isNaN;

/* eslint-disable no-self-compare */
function isNumber(value) {
  return /^\d+(\.\d+)?$/.test(value);
}

function isNaN(value) {
  if (Number.isNaN) {
    return Number.isNaN(value);
  }

  return value !== value;
}