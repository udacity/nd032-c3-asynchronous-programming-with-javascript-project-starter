import RaceSimApi from '../../race-sim-api';
import simulateRace from './simulate-race';
import simulateAll from './simulate-all';

const api = new RaceSimApi();

class RaceSim {
  simulate(trackId, driverIds) {
    /**
     * Runs a single simulation for a given track and list of drivers
     * 
     * @param {integer}             trackId     ID of race track.
     * @param {array of integers}   driverId    List of IDs of drivers.
     */
    return simulateRace(trackId, driverIds);
  }
  simulateAll(racesSettings) {
    return simulateAll(racesSettings);
  }
  simulateForAllTracks(trackIds, driverIds, repeatDuration) {
    /**
     * Runs a simulations for every track, using all drivers per race
     * NOTE: aim for an optimal solution, so results are generated quickly.
     * 
     * @param {array of integers}   trackId     List of IDs of race track.
     * @param {array of integers}   driverIds   List of IDs of drivers.
     */
    const racesSettings = trackIds.map(trackId => ({ trackId, driverIds }));
    return simulateAll(racesSettings, repeatDuration && { repeatDuration });
  }
}

export default RaceSim;
