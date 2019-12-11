'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _raceSimApi = require('../../race-sim-api');

var _raceSimApi2 = _interopRequireDefault(_raceSimApi);

var _simulateRace = require('./simulate-race');

var _simulateRace2 = _interopRequireDefault(_simulateRace);

var _simulateAll2 = require('./simulate-all');

var _simulateAll3 = _interopRequireDefault(_simulateAll2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = new _raceSimApi2.default();

var RaceSim = function () {
  function RaceSim() {
    (0, _classCallCheck3.default)(this, RaceSim);
  }

  (0, _createClass3.default)(RaceSim, [{
    key: 'simulate',
    value: function simulate(trackId, driverIds) {
      /**
       * Runs a single simulation for a given track and list of drivers
       * 
       * @param {integer}             trackId     ID of race track.
       * @param {array of integers}   driverId    List of IDs of drivers.
       */
      return (0, _simulateRace2.default)(trackId, driverIds);
    }
  }, {
    key: 'simulateAll',
    value: function simulateAll(racesSettings) {
      return (0, _simulateAll3.default)(racesSettings);
    }
  }, {
    key: 'simulateForAllTracks',
    value: function simulateForAllTracks(trackIds, driverIds, repeatDuration) {
      /**
       * Runs a simulations for every track, using all drivers per race
       * NOTE: aim for an optimal solution, so results are generated quickly.
       * 
       * @param {array of integers}   trackId     List of IDs of race track.
       * @param {array of integers}   driverIds   List of IDs of drivers.
       */
      var racesSettings = trackIds.map(function (trackId) {
        return { trackId: trackId, driverIds: driverIds };
      });
      return (0, _simulateAll3.default)(racesSettings, repeatDuration && { repeatDuration: repeatDuration });
    }
  }]);
  return RaceSim;
}();

exports.default = RaceSim;