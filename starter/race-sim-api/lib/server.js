'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _port = require('./port');

var _port2 = _interopRequireDefault(_port);

var _crasher = require('./crasher');

var _crasher2 = _interopRequireDefault(_crasher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var data = {
  'tracks': [{
    id: 1,
    name: 'Gravel Swirly World'
  }, {
    id: 2,
    name: 'Route 66'
  }, {
    id: 3,
    name: 'Antarctic Slide'
  }],
  'simulations': [],
  'drivers': []
};

var getDriverProgress = function getDriverProgress(simId, driverId, duration) {
  var race = data.simulations.find(function (sim) {
    return sim.id = simId;
  });
  if (!race) throw new Error('Cannot find race, so cannot get driver progress in race');
  switch (driverId) {
    case 1:
      return 5;
    case 2:
      return Math.round(Math.random() * 5 * duration);
    default:
      return Math.round(Math.random() * 15);
  }
};

app.put('/simulations/:simulationId', function (req, res) {
  return new _promise2.default(function (resolve, reject) {
    setTimeout(function () {
      var simulationId = req.params.simulationId;
      var _req$query = req.query,
          winningDriverId = _req$query.winningDriverId,
          finished = _req$query.finished;

      var i = data.simulations.findIndex(function (sim) {
        return sim.id === simulationId;
      });
      if (i === -1) {
        return reject('Not found');
      }
      if (!winningDriverId) {
        var sim = data.simulations[i];
        if (sim.finished) {
          return reject('Simulation already finished. Cannot edit a simulation that ended.');
        }
        sim.winningDriverId = winningDriverId;
        sim.finished = finished;
        return resolve({
          id: sim.id,
          winningDriverId: sim.id,
          finished: sim.finished
        });
      }
    }, 1000).then(function (result) {
      return res.json(result);
    }).catch(function (errMessage) {
      if (errMessage === 'Not found') {
        return res.sendStatus(404).send(errMessage);
      }
      return res.sendStatus(500).send(errMessage);
    });
  });
});

app.put('/simulations/:simulationId/drivers/:driverId/simulateProgress', function (req, res) {
  var _req$params = req.params,
      simulationId = _req$params.simulationId,
      driverId = _req$params.driverId;


  return new _promise2.default(function (resolve, reject) {
    // simulate time to request data from server	
    setTimeout(function () {
      var simIdx = data.simulations.findIndex(function (sim) {
        return sim.id === simulationId;
      });
      if (simIdx === -1) {
        return reject('Not found');
      }

      var sim = data.simulations[simIdx];
      if (sim.finished) {
        return reject('Simulation already finished. Cannot edit a simulation that ended.');
      }

      var crashed = (0, _crasher2.default)();
      if (crashed) {
        console.log('At ' + duration + ' seconds, driver ' + driverId + ' crashed');
        return resolve({
          crashed: true,
          progress: 0
        });
      }
      sim.driverDuration[driverId] = sim.driverDuration[driverId] || 0;
      sim.driverDuration[driverId]++;
      var duration = sim.driverDuration[driverId];
      var progress = getDriverProgress(sim.id, driverId, duration);
      console.log('On second ' + duration + ' of the race, driver ' + driverId + ' progresses ' + progress + ' meters');

      return resolve({
        crashed: false,
        progress: progress
      });
    }, 2000 * Math.random());
  }).then(function (result) {
    return res.send(result);
  }).catch(function (errMessage) {
    if (errMessage === 'Not found') {
      return res.sendStatus(404).send(errMessage);
    }
    return res.sendStatus(500).send(errMessage);
  });
});

app.listen(_port2.default || 8888, function () {
  return console.log('\t\nDriver API Server is now running on localhost:' + _port2.default + '...\t\nHit Ctrl+C to quit this server.\t\n');
});