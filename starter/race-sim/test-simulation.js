import RaceSim from './race-sim';
import RaceSimApi from './race-sim-api';
import { test, describe } from 'jest';

const raceSim = new RaceSim();
const api = new RaceSimApi();

(async function (){
  
  describe('RaceSim', () => {
    test('can run a single simulation of a race', () => {
      const drivers = await api.fetchDrivers();
      const raceTracks = await api.fetchTracks();
      let results;
      results = await api.fetchSimulationResults();
      const numPrevResults = results.length;
      
      const track = raceTracks[0];
      await raceSim.runSimulation(track, drivers);
      results = await api.fetchSimulationResults();

      expect(results.length).toEqual(numPrevResults + 1);
    })
  })
})();

