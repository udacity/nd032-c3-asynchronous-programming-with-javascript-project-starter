import express from 'express';	
import port from './port';	
import getIfCrashed from './crasher';	

const app = express();	

const data = {	
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
  'drivers': [],	
};	

const getDriverProgress = (simId, driverId, duration) => {	
  const race = data.simulations.find(sim => sim.id = simId);	
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

app.put('/simulations/:simulationId', (req, res) => {	
  return new Promise((resolve, reject) => {	
    setTimeout(() => {	
      const { simulationId } = req.params;	
      const { winningDriverId, finished } = req.query;	
      const i = data.simulations.findIndex(sim => sim.id === simulationId);	
      if (i === -1) {	
        return reject('Not found');	
      }	
      if (!winningDriverId) {	
        const sim = data.simulations[i];	
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
    }, 1000)	
    .then((result) => res.json(result))	
    .catch((errMessage) => {	
      if (errMessage === 'Not found') {	
        return res.sendStatus(404).send(errMessage);	
      }	
      return res.sendStatus(500).send(errMessage);	
    });	
  });	
});	

app.put('/simulations/:simulationId/drivers/:driverId/simulateProgress', (req, res) => {	
  const { simulationId, driverId } = req.params;	

  return new Promise((resolve, reject) => {	
    // simulate time to request data from server	
    setTimeout(() => { 	
      const simIdx = data.simulations.findIndex(sim => sim.id === simulationId);	
      if (simIdx === -1) {	
        return reject('Not found');	
      }	

      const sim = data.simulations[simIdx];	
      if (sim.finished) {	
        return reject('Simulation already finished. Cannot edit a simulation that ended.');	
      }	

      const crashed = getIfCrashed();	
      if (crashed) {	
        console.log(`At ${duration} seconds, driver ${driverId} crashed`);	
        return resolve({	
          crashed: true,	
          progress: 0,	
        });	
      }	
      sim.driverDuration[driverId] = sim.driverDuration[driverId] || 0;	
      sim.driverDuration[driverId]++;	
      const duration = sim.driverDuration[driverId];	
      const progress = getDriverProgress(sim.id, driverId, duration);	
      console.log(`On second ${duration} of the race, driver ${driverId} progresses ${progress} meters`);	

      return resolve({	
        crashed: false,	
        progress,	
      });	
    }, 2000 * Math.random())	
  })	
  .then(result => res.send(result))	
  .catch((errMessage) => {	
    if (errMessage === 'Not found') {	
      return res.sendStatus(404).send(errMessage);	
    }	
    return res.sendStatus(500).send(errMessage);	
  });	
});	

app.listen(port || 8888, () => console.log(`	
Driver API Server is now running on localhost:${port}...	
Hit Ctrl+C to quit this server.	
`));	
