# RaceSim API Reference

Provided in this project is the RaceSim API, a promise-based interface for interacting with the RaceSim server. The API allows one to:

- Retrieve data on the race tracks, strategies, and cars to simulate.
- Track a simulation at the start of a new simulated race
- Simulate a single driver’s progress during a race
- Track the end of a simulation and its results when a race ends

**Contents of this folder are not meant to be edited. Your RaceSim application should work with the RaceSim API and RaceSim Server as-is.**

### Instantiate the API

Example:

```
const RaceSimApi = require(‘./race-sim-api’);

const api = new RaceSimApi();
```


---

### Available Methods

#### Retrieve data on the race tracks, strategies, and cars to simulate.

The designers at NASCAR have designed a few candidate cars and race strategies for winning
across several race tracks. They've stored information about the race tracks they are
interested in running simulations with, and have put them on the RaceSim Server. You can fetch them like so.

Usage:

```
api.fetchTrack(3).then(resp => console.log(resp));
// => { id: 1, name: 'Rose Motorsports Parkway', ... }

api.fetchTracks().then(resp => console.log(resp));
// => [{ id: 1, name: 'Rose Motorsports Parkway’, totalDistance: 100 }, ...]
// entire list of tracks

api.fetchStrategy(1).then(resp => console.log(resp));
// => { id: 1, name: ‘Ace Driving’' }

api.fetchStrategies().then(resp => console.log(resp));
// => [{ id: 1, name: ‘Ace Driving’' }, ...]
// entire list of strategies

api.fetchDriver(1).then(resp => console.log(resp));
// => { id: 1, strategy: { id: 1, name: ‘Ace Driving’ }, car: { id: 1, name: ‘Dirt Pro’ } }

api.fetchDrivers().then(resp => console.log(resp));
// => [{ id: 1, strategy:...}, ...]
// entire list of drivers

api.fetchCar(1).then(resp => console.log(resp));
// => { id: 1, car: 'Dirt Pro'}

api.fetchCars().then(resp => console.log(resp));
// => [{ id: 1, car: 'Dirt Pro'}, ...]
// entire list of cars
```

#### Fetch Drivers
The API also offers a method for retrieving drivers, where a *driver* is defined as a specific racing strategy paired with a specific racing car.

`fetchDriver(strategyId: int, carId: int)` can be used like so:

Usage:
```
const strategyId = 1;
const carId = 1;


api.fetchDriver(strategyId, carId)
  .then(resp => console.log(resp));  // => { id: 1, strategy: { id: 1, name: ‘Ace Driving’ }, car: { id: 1, name: ‘Dirt Pro’ } }
```

Where `id` 1 is the driver ID, followed by information about the driver’s strategy and car.


#### Fetch simulations

`fetchSimulation([finished, startDate])`

Parameters:

* `finished`: (optional) boolean. If true, only fetches finished simulations. If false, fetches both finished and unfinished simulations.
* `startDate`: (optional) Date object. If present, only returns results for simulations that started on `startDate` or later.


Usage:
```
api.fetchSimulations();
```
Fetches a list of simulation objects, including those that haven’t finished, from all time.

An example simulation object in the list would be:
```
{
  id: 52,
  winner: { id: 1, name: ‘Dirt Pro’, …},
  started: "2019-11-25T07:12:53.088Z",
  finished: "2019-11-25T07:13:28.088Z"
}
```
where `winner` is the winning driver, `started` is the datetime of when the simulation started, and `finished` is the datetime (in ISO format) of when the simulation ended.

To fetch just simulations that have finished (across all time):

`api.fetchSimulations(true);`

To fetch just simulations that have not finished (either because the race end had not been tracked yet, or it had not yet occurred):

`api.fetchSimulations(false);`

To fetch simulations that have both finished and whose simulations began being tracked in the past 30 seconds:
```
const seconds = 30;
const date = new Date();
const date30SecondsAgo = new Date(dateNow.getTime() - seconds * 1000);

api.fetchSimulations(true, date30SecondsAgo);
```

---

#### `trackSimulationStart()`: track a simulation at the start of a race

Create a new simulation record on the server to track a new race simulation on the server, and return an object with the newly created ID of the simulation. A new race takes a given race track, and a set of drivers to drive on them.

Usage:

```
api.trackSimulationStart()
  .then(resp => console.log(resp));
/*
 => {
  winner: null,
  finished: false,
  start: 'Wed, 27 Nov 2019 20:38:42 GMT',
  id: 1
}
 */
```

where `trackId` is an ID of a race track object retrieved from the server, and `driverIds` is a list of IDs of driver objects retrieved from the server. `trackSimulationStart` returns an object with the ID of the newly created tracked simulation object.

Hint: Note that `trackId` and `driverIds` needs to be already known before we can begin tracking information about the simulation, and the data on available race tracks and drivers must be retrieved from the server.

---

#### `simulateRaceDriverProgress(driverId, simulationId[, prevRaceSecond])`: simulate a driver’s mid-race progress

Parameters:

* `driverId`: (required) integer. ID of a driver tracked on the server.
* `simulateId`: (required) integer. ID of a simulation tracked on the server.
* `prevRaceSecond`: (optional) integer. The Nth second of the race in the previous second. If present, the API will either update the simulation progress of the (N+1)th second of the race and overwrite it, if present, or it will write a new record of simulated progress for the (N+1)th second.

Scientists at NASCAR have developed probabilistic models for simulating how a driver would
react mid-race, and they have made their models interactable via the RaceSim API for simulating a driver’s progress during a simulated race.

An important assumption we make is that every time `simulateRaceDriverProgress` gets called, a second of the race passes for that driver. To make a second of the entire race pass for all drivers, `simulateRaceDriverProgress` needs to have been called for all drivers.

Their models take in knowledge of the current simulation and all of its tracked progress, and for a given driver, determines if the car would possibly crash in the next second of traversing the race track, or whether it doesn't crash and determines the approximate distance the car would accomplish over the next second of traversing the race track.

Note that these models are probabilistic, which means they don't always return the same distance accomplished or the same crash condition with every simulation, even if given the same racing parameters. These models can also only determine what an individual driver would do if it was told to keep going along a race track, and are unaware of who wins a race or when.

These models will rely on the history of all other calls to `simulateRaceDriverProgress` for the given driver, to determine the driver’s next move, so every call of `simulateRaceDriverProgress` for the given driver and simulation relies on every other call before it.

Note that if the driver had previously crashed, then making additional calls to simulate additional driver progress will raise an error, because a driver cannot keep progressing after they have already crashed.

Example Usage:

```
const driverId = 1;
const simulationId = 32;
api.simulateRaceDriverProgress(driverId, simulationId)
  .then(result => console.log(result));
  // => {
  //    simulationId: 32,
  //    driverId 1,
  //    crashed: false,
  //    raceSecond: 15, 
  //    distance: 4
  //  }
```
In this example, the driver doesn’t crash and progresses 4 meters over the next second, during the 15th second of the race.

`simulationId` points to the unique identifier (ID) of the currently running simulation being tracked on the server, as retrieved via `trackSimulationStart`. Note that the RaceSim Server cannot return results for a driver’s progress if it hadn’t started tracking a simulated race at the beginning of the race, first.

---


#### `trackSimulationEnd(simulationId, winningDriverId)`: track a simulation’s end race results at the end of a race

Track the end race results, logging the results back to the server.

Parameters:

* `simulationId`: ID of a simulation tracked on the server.
* `winningDriverId`: ID of a driver stored on the server.

Usage:
```
const simulationId = 23;
const winningDriverId = 1;
api.trackSimulationEnd(simulationId, winningDriverId);
// => {
//         id: 52,
//         started: "2019-11-25T07:12:53.088Z",
//         finished: "2019-11-25T07:13:28.088Z",
//         winningDriver: {
//              id: 1,
//              strategy: { id: 1, name: ‘Ace Driving’ },
//              car: { id: 1, name: ‘Dirt Pro’ }
//         }
//       }
```
Output: simulation object, updated with `finished` timestamp, and the winning driver, if any.

If a given race has no winners at the end because all players crashed before reaching the finish line, track a simulation with no winners by calling:

```
api.trackSimulationEnd(simulationId, null);
```
