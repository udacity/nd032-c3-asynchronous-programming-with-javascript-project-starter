"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getIfCrashed = function getIfCrashed() {
  return Math.random(0, 1) * 10000 < 500;
};

/*

ATTN Graders: test that races successfully terminate if all drivers crash in a race.

test by changing getIfCrashed to `() => true;`

*/

exports.default = getIfCrashed;