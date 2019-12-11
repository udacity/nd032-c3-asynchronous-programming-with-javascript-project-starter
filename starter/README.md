RaceSim
---

## Introduction

In this final project, we will be creating a simulation application called RaceSim. This application is capable of simulating races for a number of hypothetical drivers using different race strategies and race cars on a race track. NASCAR hopes to use the RaceSim application you are developing to gain insight on understanding the best-designed race cars and race strategies they can employ for winning races on various race tracks. Using simulations, NASCAR teams can run millions of them, quickly and cheaply, while gaining incredible insight they never would have had the resources to do from just real-life races.

The car designers and strategists at NASCAR hope to run millions of simulations with your RaceSim application, using many different variations of racing cars and race strategies for a given race track, so they can analyze the past simulation winners and understand effective car design and racing strategy for winning on different race tracks.

## Overview

RaceSim will need to (asynchronously) interact with a server via the provided RaceSim API, a node module you will be importing into RaceSim to interact with the server, in order to simulate races and track past simulation results. RaceSim will also need to provide insights to its users after simulations are finished running with aggregate insights from past simulations so that users can understand which race strategy and race car won the most number of times.

By the end of this project, you should have a fully functioning race simulator that is at least capable of doing the following, if not more:

* running single simulations of races between multiple cars using different racing strategies on a given race track
* running multiple simulations in "bulk" / in parallel of multiple races with different race parameters.
* repeatedly running multiple simulations in parallel for a set amount of time, and returning aggregate insights on the simulation winners at the end of the scheduled time.

## Tech Stack

Our tech stack will include:

* NodeJS
* NPM
* Nodemon for live-reloading node
* Babel for Javascript transpilation, so that ES6 and ES7 is available to code with.
* JSON Server for implementing the mock server

## File Structure

```
race-sim/ <-- RaceSim application folder
  - race-single-race.js     <-- for completing objective 1
  - race-multiple-races.js  <-- for completing objective 2

race-sim-api/   <-- contains RaceSim Server and RaceSim API
```

### Race Properties

Races have several properties:

1. Every race takes place on a given race track.

  * Every race track has different conditions that would be advantageous to certain cars and racing strategies over others. 

  * A driver uses a given car and racing strategy to compete in a race. 

  * There are one or more drivers per race, as well as one race track per race. 

  * Every race track has different total distances to the finish line and have unique names.


1. **Race success condition**: A race succeeds when it ends. There are two reasons to end a race:

  * A winner of the race was determined. A driver wins a race by being the first to cross the finish line. They cross the finish line when they travel a total distance that meets or exceeds the total distance of the race track itself.

  * It was determined that the race has 0 winners. All drivers competing in the race crash before reaching the finish line, rendering the race finished with no winner. The race should end as soon as the _last_ uncrashed driver also crashes before reaching the finish line.

  * All but 1 driver crashed. The remaining driver is the de facto winner.

1. **Race failure condition**: A race can fail if it runs into an issue with simulating the race (cannot retrieve results from the server, runs into resource constraints, etc.).

1. We define a *driver* as a specific racing strategy paired with a specific racing car.

1. **Handle race crashes**: A driver can occasionally crash during a race, and when a crash happens, they are eliminated from the race, while all other drivers can continue to compete for the rest of the race.

1. For simplification, you can assume that every race (that does not fail) is won with only 1 winner. There is no need to handle ties.


### Application Architecture

RaceSim is an application that interacts with a RaceSim Server, which is a service that is meant to track and manage data about race simulations and their objects -- race tracks, strategies, and cars -- as well as provide probabilistic models for simulating a driver’s progress during a race. 

RaceSim will need to interact with the server completely through the RaceSim API, which has been built and provided for you in this project. See the [API Reference](./race-sim-api/README.md) in the `./race-sim-api` folder.

## Development

#### Installations
To run the server, have the following dependencies installed on your machine:

* NodeJS and npm. Download both at https://www.npmjs.com/get-npm

* [JSON Server](https://github.com/typicode/json-server), which is used internally by the RaceSim Server to fake API requests. Don’t worry if you don’t know what it does or what API requests are. You’ll mostly be interacting with the RaceSim API instead of interacting with the server directly. 

Follow the *one-time setup* instructions below to install the required dependencies.

#### Prerequisite executables

In your terminal, after installing NPM, run:

```
npm install -g json-server  # used by the RaceSim Server
npm install -g nodemon      # optional; to enable live-reload of node app upon changes
```

#### Running the Race Sim API server

Open your terminal application and in a separate tab, run:

```
cd PATH_TO_YOUR_PROJECT_DIRECTORY/race-sim-api/

# one-time setup
npm install

# to run development
npm run build   # run in a separate terminal tab
npm start       # run in a separate terminal tab
```

Be sure to build and run the server prior to building the RaceSim application (steps below).

#### Running the Race Sim Application

Open your terminal application and in a separate tab, run:

```
cd PATH_TO_YOUR_PROJECT_DIRECTORY/race-sim/

# one-time setup
npm install

# to run development
npm run build   # run in a separate terminal tab
npm start       # run in a separate terminal tab
```

Develop RaceSim in the provided `race-sim.js` file in `race-sim/`. Feel free to create more sub-files and import them into `race-sim.js` using node `import` or `require`.

NOTE: All example code below will assume a location of `./race-sim/app.js`. Source code should be written in files located in the `src/` directory, and auto-generated (via `npm run build`) into the `lib/` directory. Work in `src/` and generally leave `lib/` alone. Note that if `src/` has compilation issues, the terminal running `npm run build` will show helpful error debug messages for fixing your compilation issues. This pattern applies to both the `race-sim/` and `race-sim-api/`.

## Application Objectives

Using the RaceSim API described below, we want to achieve each of the following objectives:

1. Run and track an individual race simulation.
  - CHALLENGE (optional): can you implement a race simulation in a way that invokes the least number of calls to `api.simulateRaceDriverProgress` possible? Hint: how do we know, in a real race, as soon as a winner is determined? Hint 2: can we use `Promise.race` and/or `Promise.all` somehow? Can we use both of them together? (Note that `Promise.any` is not supported in this environment.)
2. Run and track a combination of race simulations.
3. Repeatedly run and track a combination of race simulations, indefinitely, until stopping after a set amount of time. For example, the NASCAR team may want to run simulations for 2 hours and then check back in 2 hours to see the aggregate results of all simulations that ran during that time.

 Implement these application objectives using best practices for error handling,performance, code maintainability and readability. In particular, we should not be running into `UnhandledPromiseRejectionWarning` warnings, because all promise rejections should be properly handled, and ES6 + advanced Array methods are fully leveraged.
 - Gracefully handle errors from the server. The server can intermittently time out or refuse a connection, causing an error from the API.
 - **Avoid writing any nested "callback hell" code at all cost**. Review the lesson strategies for doing so.

Appliction Objectives described in detail:

#### 1. Run and track an individual race simulation

RaceSim should be capable of running an individual simulation of a race for multiple drivers on various race tracks and track the results on the server.

* Offer a promise-based method called `simulateRace` for simulating a race with a selected race track ID and selected driver IDs from the server. Your module should export a class method on RaceSim called `Simulation`, whose instance returns a promise that offers a way for one to wait until the simulation finishes to resolve finished simulation results. Handle success and failure accordingly.
* Offer a promise-based method called `simulateRace` for simulating a race with a selected race track ID and selected driver IDs from the server, and tracking that simulation's start. Your module should export a class method on RaceSim called `simulate` (provided in `./race-sim/src/race-sim.js`) that, upon finish, resolves results from the simulation in the form `{ winner: [driver object, or null], message: string, simulationId: num }`. Be sure to handle success and failure accordingly. The next sub-objective 1.1 explains the requirement for tracking the simulation's end.

Example: in `./race-sim/app.js`, we can run:

```
import RaceSim from './race-sim.js';

const trackId = 101;
const driverIds = [1, 2, 3, 5];

const raceSim = new RaceSim();

raceSim.simulate(trackId, driverIds)
.then(endResult => console.log(endResult));

/* => if simulation failed, returns an error object; 
 *    otherwise, if successful: prints
 *    {
 *      winner: {
 *        id: 1,
 *        carId: 45,
 *        strategyId: 777,
 *        crashed: false
 *      },
 *      message: 'Race won by driver #1 at 5 sec',
 *      simulationId: 1 // ID of tracked simulation
 *   }
 *
 */
```

Desired result object parameters:
* `winner`: object of winning driver, fetched from the server (via `api.fetchDrivers` or `api.fetchDriver`)
* `message`: contextual string describing what happened at the end of the race (either who won and when, or whether all drivers crashed)
* `simulationId`: ID of the newly tracked simulation object that RaceSim had begun tracking from the simulation run. (Note: in the next sub-objective 1.1, we track the simulation's end results as well).

* Simulation results should highlight the winner of the simulation. The `winner` attribute returned is a Driver object, but it can also (and should) sometimes be `null` if all players crash in a race before reaching the finish line, per the [Race Properties](#race-properties).
* Write the solution to the `simulate` method above in `./race-sim/simulate-race.js`. Others should be able to use your node module in the future to run individual simulations with various drivers and race tracks.
* A Simulation needs to not violate any of the properties of a race. See section [Race Properties](#race-properties) for full list.
* A Simulation should only simulate with track IDs and driver IDs of tracks and drivers from the RaceSim server. The RaceSim server will throw an error, otherwise. Call the API (see the API reference) to understand the available tracks and drivers.
* Hint: Use 1 or more promise collection methods in your solution, while taking addvantage of all the properties of a race. Consider sketching the solution in psuedocode before implementing it with Promises, async/await, etc. You may use either Promises, Async/Await, or some combination of both in your solution.


##### Sub Objective 1.2: Track simulation end results on the RaceSim Server


After running a simulation, have `RaceSim#simulate` track the results on the RaceSim Server via a call to the RaceSim API method `trackSimulationEnd`. `RaceSim#simulate` should still resolve the results of the race in a `{ winner, message, simulationId }` object upon successful finish. Optionally console log the race results to the terminal.


#### Run multiple race simulations at a time

In addition to letting the NASCAR scientists run a single simulation, they may also want to define a set of race simulations they would like to run, and run them.

Given a set of driver IDs and race track IDs (which come from the database), allow a user to call a method called `simulateAll` on RaceSim to run multiple simulations at a time. `simulateAll` is a function located in `./simulate-all.js`.

Example:
```
const raceSim = new RaceSim();
raceSim.simulateAll([
  { trackId: 101, driverIds: [1, 2, 5] },
  { trackId: 202, driverIds: [1, 2, 5] },
  { trackId: 303, driverIds: [1, 2, 5] }
]);
```


`simulateAll` should ideally run all of its races concurrently, so that we get the results of the races as quickly as possible. As we get the results of each race, we should of course track them by interacting with the server to track the end of each simulation (via `api.trackSimulationEnd`), so that if we were to late call

```
api.fetchSimulations(true);
```

after the simulations have finished running, we would get back a set of results that include the simulations we just ran.

Hint: implementing this is simpler than the instructions make them out to be.


#### Repeatedly run multiple race simulations until a given time

The scientists at NASCAR are interested in repeatedly running a set of simulations continuously, in high volumes, for a set period of time, and scheduling when they can come back later to analyze the results.

Let `simulateAll` (from above) take in an optional 2nd argument, `{ repeatDuration: numOfSeconds }` where `repeatDuration` is the amount of time in seconds that a scientist wants the simulations to stop running.

Example Usage:

```
const startDateTime = new Date();
simulator.simulateAll([{
  trackId: 101, driverIds: [1, 2, 5] }, {
  trackId: 202, driverIds: [1, 2, 5] }, {
  trackId: 303, driverIds: [1, 2, 5]
}], { repeatDuration: 60 }); // will run for 60 seconds
```

Then, in 60 seconds, a user should be able to call `api.fetchSimulations(true, startDateTime)` and see all the results of the simulations that RaceSim just ran in those 60 seconds.

#### Execute simulations in high volumes.


RaceSim should be able to execute high volumes of simulations, very quickly. NASCAR wants to run millions of simulations in a short period of time.

To avoid server overload, the RaceSim API  has been rate limited: it can only handle a maximum of 5 requests per second. If more than 5 requests are trying to hit the API at a given second, it will throw an error that says “API Rate Limit hit. Request not executed.”

We are interested in executing as many simulations at a time as possible.

Choose a strategy that makes sense to allow RaceSim to push as many requests as possible. For example, you can consider using sleep, or pausing and then re-attempting a request if the API Rate Limit is hit. 

Implement a strategy for conquering API rate limiting to maximize on the number of requests we can make per second.
