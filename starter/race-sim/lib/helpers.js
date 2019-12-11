"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatSimsResults = exports.getDriverLabel = undefined;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDriverLabel = exports.getDriverLabel = function getDriverLabel(simResult) {
  return "Driver #" + simResult.winner.id + " (" + simResult.winner.name + ")";
};
var formatSimsResults = exports.formatSimsResults = function formatSimsResults(results) {
  /*
    give an aggregate message summarizing stats from all simulation runs
    for example:
       Total Number of Simulations:                                 3
      Total Number of races with winners:                          3
      Total Number of races with 0 winners (all drivers crashed):  0
       Number of races won per driver:
       Driver #3 (Camn Driver):                              2
      Driver #5 (Evyl Driver):                              1
  */

  var totalSims = 0,
      wonRaces = 0,
      allDriversCrashedRaces = 0,
      winnerCounts = {};
  results.forEach(function (simResult) {
    totalSims += 1;
    if (simResult.winner && simResult.winner.id) {
      // there was a winner
      wonRaces += 1;
      var driverLabel = getDriverLabel(simResult);
      winnerCounts[driverLabel] = (winnerCounts[driverLabel] || 0) + 1;
    } else {
      // there was a race with no winner (everyone crashed)
      allDriversCrashedRaces += 1;
    }
  });
  return "\n    Total Number of Simulations:                                 " + totalSims + "\n    Total Number of races with winners:                          " + wonRaces + "\n    Total Number of races with 0 winners (all drivers crashed):  " + allDriversCrashedRaces + "\n\n    Number of races won per driver:\n\n" + (0, _keys2.default)(winnerCounts).map(function (driverLabel) {
    return "   " + driverLabel + ":                              " + winnerCounts[driverLabel];
  }).join("\n");
};