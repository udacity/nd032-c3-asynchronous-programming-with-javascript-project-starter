"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// DO NOT EDIT

var getDriverProgress = function getDriverProgress(driverId, raceSecond) {
  switch (driverId) {
    case 1:
      return 5;
    case 2:
      return Math.round(Math.random() * 5 * raceSecond);
    case 3:
      return Math.round(Math.random() * 5 * raceSecond);
    default:
      return Math.round(Math.random() * 15);
  }
};

exports.default = getDriverProgress;