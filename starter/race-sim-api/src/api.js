import fetch from 'node-fetch';
import getIfCrashed from './crasher';
import getDriverProgress from './driver-progress';

const API_HOST = 'http://localhost:8888';

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// TODO: API LIMIT RATE of 5 per second. “API Rate Limit hit. Request not executed." error to raise.
const thenHandler = resp => {
  if (resp.status === 200 || resp.status === 201) {
    return resp.json();
  } else {
    return Promise.reject(resp);
  }
};
const catchHandler = resp => {
  return resp.status ?
    Promise.reject({
      message: `Server Error [url: ${resp.url}]: ${resp.status} ${resp.statusText}`,
      status: resp.status
    })
    : Promise.reject(resp);
}

const wrappedFetch = (route, custom) => fetch(route, {
  ...custom,
  headers: {
    ...(custom && custom.headers || {}),
    'Content-Type': 'application/json'
  }
})
  .then(thenHandler)
  .catch(catchHandler);

class RaceSimApi {
  fetchTrack(id) {
    return wrappedFetch(`${API_HOST}/tracks/${id}`);
  }
  fetchTracks() {
    return wrappedFetch(`${API_HOST}/tracks`);
  }
  fetchDriver(id) {
    return wrappedFetch(`${API_HOST}/drivers/${id}`);
  }
  fetchDrivers() {
    return wrappedFetch(`${API_HOST}/drivers`);
  }
  fetchStrategy(id) {
    return wrappedFetch(`${API_HOST}/strategies/${id}`);
  }
  fetchStrategies() {
    return wrappedFetch(`${API_HOST}/strategies`);
  }
  fetchCar(id) {
    return wrappedFetch(`${API_HOST}/cars/${id}`);
  }
  fetchCars() {
    return wrappedFetch(`${API_HOST}/cars`);
  }
  async fetchDriver(strategyId, carId) {
    if (isNaN(strategyId)) return Promise.reject(`fetchDriver expected strategyId to be a number. Got ${strategyId} instead.`);
    if (isNaN(carId)) return Promise.reject(`fetchDriver expected carId to be a number. Got ${carId} instead.`);
    return wrappedFetch(`${API_HOST}/drivers`);
  }
  async fetchSimulations(finished, simStartTime) {
    if (simStartTime && !isValidDate(simStartTime)) {
      return Promise.reject(`fetchSimulations expected 2nd argument simStartTime to be a valid date. Got ${simStartTime}.`);
    }
    if (finished === undefined || finished === null) {
      if (!simStartTime) {
        return wrappedFetch(`${API_HOST}/simulations`);
      } else {
        return wrappedFetch(`${API_HOST}/simulations?start=${simStartTime.toISOString()}`);
      }
    }
    if (finished === false || finished === true) {
      return wrappedFetch(`${API_HOST}/simulations?finished=${finished}`);
    }
    return Promise.reject(`Unexpected argument for fetchSimulations. Expected true, false, or undefined. Got ${fetchSimulations}`);
  }
  trackSimulationStart() {
    return wrappedFetch(`${API_HOST}/simulations`, {
      method: 'POST',
      body: JSON.stringify({
        winner: null,
        finished: false,
        start: new Date().toUTCString(),
      })
    });
  }
  trackSimulationEnd(simulationId, winningDriverId) {
    if (winningDriverId !== null && isNaN(winningDriverId)) return Promise.reject(`trackSimulationEnd expected winningDriverId to be null or a number. Got ${winningDriverId} instead.`);
    if (isNaN(simulationId)) return Promise.reject(`trackSimulationEnd expected simulationId to be a defined number. Got ${simulationId} instead.`);

    try {
      return wrappedFetch(`${API_HOST}/drivers/${winningDriverId}`)
        .then(winningDriver => {
          return wrappedFetch(`${API_HOST}/simulations/${simulationId}`, {
            method: 'PUT',
            body: JSON.stringify({
              winner: winningDriver,
              finished: true,
            })
          });
        });
    } catch(e) {
      const message = msg => `Error with api.trackSimulationEnd: ${msg}`;
      return Promise.reject(
        e.message ?
        { ...e, message: message(e.message) } :
        { message: message(e) }
      );
    }
  }
  async simulateRaceDriverProgress(driverId, simulationId, prevRaceSecond) {
    if (isNaN(driverId)) return Promise.reject(`Error with api.simulateRaceDriverProgress: expected driverId to be a number. Got ${driverId} instead.`);
    if (isNaN(simulationId)) return Promise.reject(`Error with api.simulateRaceDriverProgress: expected simulationId to be a number. Got ${simulationId} instead.`);
    // if simulation finished, throw error
    try {
      const sim = await wrappedFetch(`${API_HOST}/simulations/${simulationId}`);
      if (!sim) {
        return Promise.reject(`Error with api.simulateRaceDriverProgress: Simulation with ID ${simulationId} not found. Cannot simulate additional driver progress.`);
      }
      if (sim.finished) {
        return Promise.reject('Error with api.simulateRaceDriverProgress: Simulation finished! Cannot simulate additional driver progress on a finished simulation.');
      }
      const prevProgressions = await wrappedFetch(`${API_HOST}/simulations/${simulationId}/progressions?driverId=${driverId}&_sort=logged&_order=desc`);
      const prevProgression = prevProgressions && prevProgressions[0];
      let raceSecond = 1;
      if (prevProgression) {
        if (prevProgression.crashed) {
          return Promise.reject(`Error with api.simulateRaceDriverProgress: driver ${driverId} in simulation ${simulationId} already crashed, cannot simulate additional progress.`);
        }
        raceSecond = prevProgression.raceSecond + 1;
      }
      const crashed = getIfCrashed();
      const url = `${API_HOST}/progressions?simulationId=${simulationId}&driverId=${driverId}` +
      `${!isNaN(prevRaceSecond) ?
        `&raceSecond=${prevRaceSecond + 1}` : ''
      }`;
      const body = JSON.stringify({
        simulationId,
        driverId,
        crashed,
        raceSecond,
        distance: crashed ? 0 : getDriverProgress(driverId, raceSecond),
        logged: new Date()
      });

      if (!prevRaceSecond) {
        return wrappedFetch(url, {
          method: 'POST',
          body
        });
      }

      return wrappedFetch(url)
      .then((r) => {
        // found -> update only
        return wrappedFetch(url, {
          method: 'PUT',
          body
        });
      })
      .catch((err) => {
        if (err.status === 404) {
          // not found -> create new record
          return wrappedFetch(url, {
            method: 'POST',
            body
          });
        } else {
          return Promise.reject(err);
        }
      });
    } catch(e) {
      const message = msg => `Error with api.simulateRaceDriverProgress: ${msg}`;
      return Promise.reject(
        e.message ?
        { ...e, message: message(e.message) } :
        { message: message(e) }
      );
    }
  }

}

export default RaceSimApi;
