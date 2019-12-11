'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _crasher = require('./crasher');

var _crasher2 = _interopRequireDefault(_crasher);

var _driverProgress = require('./driver-progress');

var _driverProgress2 = _interopRequireDefault(_driverProgress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API_HOST = 'http://localhost:8888';

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// TODO: API LIMIT RATE of 5 per second. “API Rate Limit hit. Request not executed." error to raise.
var thenHandler = function thenHandler(resp) {
  if (resp.status === 200 || resp.status === 201) {
    return resp.json();
  } else {
    return _promise2.default.reject(resp);
  }
};
var catchHandler = function catchHandler(resp) {
  return resp.status ? _promise2.default.reject({
    message: 'Server Error [url: ' + resp.url + ']: ' + resp.status + ' ' + resp.statusText,
    status: resp.status
  }) : _promise2.default.reject(resp);
};

var wrappedFetch = function wrappedFetch(route, custom) {
  return (0, _nodeFetch2.default)(route, (0, _extends3.default)({}, custom, {
    headers: (0, _extends3.default)({}, custom && custom.headers || {}, {
      'Content-Type': 'application/json'
    })
  })).then(thenHandler).catch(catchHandler);
};

var RaceSimApi = function () {
  function RaceSimApi() {
    (0, _classCallCheck3.default)(this, RaceSimApi);
  }

  (0, _createClass3.default)(RaceSimApi, [{
    key: 'fetchTrack',
    value: function fetchTrack(id) {
      return wrappedFetch(API_HOST + '/tracks/' + id);
    }
  }, {
    key: 'fetchTracks',
    value: function fetchTracks() {
      return wrappedFetch(API_HOST + '/tracks');
    }
  }, {
    key: 'fetchDriver',
    value: function fetchDriver(id) {
      return wrappedFetch(API_HOST + '/drivers/' + id);
    }
  }, {
    key: 'fetchDrivers',
    value: function fetchDrivers() {
      return wrappedFetch(API_HOST + '/drivers');
    }
  }, {
    key: 'fetchStrategy',
    value: function fetchStrategy(id) {
      return wrappedFetch(API_HOST + '/strategies/' + id);
    }
  }, {
    key: 'fetchStrategies',
    value: function fetchStrategies() {
      return wrappedFetch(API_HOST + '/strategies');
    }
  }, {
    key: 'fetchCar',
    value: function fetchCar(id) {
      return wrappedFetch(API_HOST + '/cars/' + id);
    }
  }, {
    key: 'fetchCars',
    value: function fetchCars() {
      return wrappedFetch(API_HOST + '/cars');
    }
  }, {
    key: 'fetchDriver',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(strategyId, carId) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!isNaN(strategyId)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', _promise2.default.reject('fetchDriver expected strategyId to be a number. Got ' + strategyId + ' instead.'));

              case 2:
                if (!isNaN(carId)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', _promise2.default.reject('fetchDriver expected carId to be a number. Got ' + carId + ' instead.'));

              case 4:
                return _context.abrupt('return', wrappedFetch(API_HOST + '/drivers'));

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchDriver(_x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return fetchDriver;
    }()
  }, {
    key: 'fetchSimulations',
    value: function (_fetchSimulations) {
      function fetchSimulations(_x, _x2) {
        return _fetchSimulations.apply(this, arguments);
      }

      fetchSimulations.toString = function () {
        return _fetchSimulations.toString();
      };

      return fetchSimulations;
    }(function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(finished, simStartTime) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(simStartTime && !isValidDate(simStartTime))) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', _promise2.default.reject('fetchSimulations expected 2nd argument simStartTime to be a valid date. Got ' + simStartTime + '.'));

              case 2:
                if (!(finished === undefined || finished === null)) {
                  _context2.next = 8;
                  break;
                }

                if (simStartTime) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt('return', wrappedFetch(API_HOST + '/simulations'));

              case 7:
                return _context2.abrupt('return', wrappedFetch(API_HOST + '/simulations?start=' + simStartTime.toISOString()));

              case 8:
                if (!(finished === false || finished === true)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt('return', wrappedFetch(API_HOST + '/simulations?finished=' + finished));

              case 10:
                return _context2.abrupt('return', _promise2.default.reject('Unexpected argument for fetchSimulations. Expected true, false, or undefined. Got ' + fetchSimulations));

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    }())
  }, {
    key: 'trackSimulationStart',
    value: function trackSimulationStart() {
      return wrappedFetch(API_HOST + '/simulations', {
        method: 'POST',
        body: (0, _stringify2.default)({
          winner: null,
          finished: false,
          start: new Date().toUTCString()
        })
      });
    }
  }, {
    key: 'trackSimulationEnd',
    value: function trackSimulationEnd(simulationId, winningDriverId) {
      if (winningDriverId !== null && isNaN(winningDriverId)) return _promise2.default.reject('trackSimulationEnd expected winningDriverId to be null or a number. Got ' + winningDriverId + ' instead.');
      if (isNaN(simulationId)) return _promise2.default.reject('trackSimulationEnd expected simulationId to be a defined number. Got ' + simulationId + ' instead.');

      try {
        return wrappedFetch(API_HOST + '/drivers/' + winningDriverId).then(function (winningDriver) {
          return wrappedFetch(API_HOST + '/simulations/' + simulationId, {
            method: 'PUT',
            body: (0, _stringify2.default)({
              winner: winningDriver,
              finished: true
            })
          });
        });
      } catch (e) {
        var message = function message(msg) {
          return 'Error with api.trackSimulationEnd: ' + msg;
        };
        return _promise2.default.reject(e.message ? (0, _extends3.default)({}, e, { message: message(e.message) }) : { message: message(e) });
      }
    }
  }, {
    key: 'simulateRaceDriverProgress',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(driverId, simulationId, prevRaceSecond) {
        var sim, prevProgressions, prevProgression, raceSecond, crashed, url, body, message;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!isNaN(driverId)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return', _promise2.default.reject('Error with api.simulateRaceDriverProgress: expected driverId to be a number. Got ' + driverId + ' instead.'));

              case 2:
                if (!isNaN(simulationId)) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt('return', _promise2.default.reject('Error with api.simulateRaceDriverProgress: expected simulationId to be a number. Got ' + simulationId + ' instead.'));

              case 4:
                _context3.prev = 4;
                _context3.next = 7;
                return wrappedFetch(API_HOST + '/simulations/' + simulationId);

              case 7:
                sim = _context3.sent;

                if (sim) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt('return', _promise2.default.reject('Error with api.simulateRaceDriverProgress: Simulation with ID ' + simulationId + ' not found. Cannot simulate additional driver progress.'));

              case 10:
                if (!sim.finished) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt('return', _promise2.default.reject('Error with api.simulateRaceDriverProgress: Simulation finished! Cannot simulate additional driver progress on a finished simulation.'));

              case 12:
                _context3.next = 14;
                return wrappedFetch(API_HOST + '/simulations/' + simulationId + '/progressions?driverId=' + driverId + '&_sort=logged&_order=desc');

              case 14:
                prevProgressions = _context3.sent;
                prevProgression = prevProgressions && prevProgressions[0];
                raceSecond = 1;

                if (!prevProgression) {
                  _context3.next = 21;
                  break;
                }

                if (!prevProgression.crashed) {
                  _context3.next = 20;
                  break;
                }

                return _context3.abrupt('return', _promise2.default.reject('Error with api.simulateRaceDriverProgress: driver ' + driverId + ' in simulation ' + simulationId + ' already crashed, cannot simulate additional progress.'));

              case 20:
                raceSecond = prevProgression.raceSecond + 1;

              case 21:
                crashed = (0, _crasher2.default)();
                url = API_HOST + '/progressions?simulationId=' + simulationId + '&driverId=' + driverId + ('' + (!isNaN(prevRaceSecond) ? '&raceSecond=' + (prevRaceSecond + 1) : ''));
                body = (0, _stringify2.default)({
                  simulationId: simulationId,
                  driverId: driverId,
                  crashed: crashed,
                  raceSecond: raceSecond,
                  distance: crashed ? 0 : (0, _driverProgress2.default)(driverId, raceSecond),
                  logged: new Date()
                });

                if (prevRaceSecond) {
                  _context3.next = 26;
                  break;
                }

                return _context3.abrupt('return', wrappedFetch(url, {
                  method: 'POST',
                  body: body
                }));

              case 26:
                return _context3.abrupt('return', wrappedFetch(url).then(function (r) {
                  // found -> update only
                  return wrappedFetch(url, {
                    method: 'PUT',
                    body: body
                  });
                }).catch(function (err) {
                  if (err.status === 404) {
                    // not found -> create new record
                    return wrappedFetch(url, {
                      method: 'POST',
                      body: body
                    });
                  } else {
                    return _promise2.default.reject(err);
                  }
                }));

              case 29:
                _context3.prev = 29;
                _context3.t0 = _context3['catch'](4);

                message = function message(msg) {
                  return 'Error with api.simulateRaceDriverProgress: ' + msg;
                };

                return _context3.abrupt('return', _promise2.default.reject(_context3.t0.message ? (0, _extends3.default)({}, _context3.t0, { message: message(_context3.t0.message) }) : { message: message(_context3.t0) }));

              case 33:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[4, 29]]);
      }));

      function simulateRaceDriverProgress(_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
      }

      return simulateRaceDriverProgress;
    }()
  }]);
  return RaceSimApi;
}();

exports.default = RaceSimApi;