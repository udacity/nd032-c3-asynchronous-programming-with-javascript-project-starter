/*

SOLUTION TEST FILE (FOR STUDENTS AND GRADERS):


Feel free to use this file to test calls to the
RaceSim application for development and debugging.

This file may also be used by graders as smoke tests
to evaluate student solutions.

Run this file using `node app.js` in this directory.

*/

const RaceSim = require('./').default;
const helpers = require('./lib/helpers');
const app = new RaceSim();


// *********************************************************************
//
// *** TEST OBJECTIVE 1 ***
// ** This should succeed **
//
// *********************************************************************
// Uncomment ==> 
// app.simulate(101, [1, 3, 5]);




// *********************************************************************
//
// *** TEST OBJECTIVE 1 ***
// ** This should fail **
//
// *********************************************************************
// Uncomment ==> 
// app.simulate(101, [1, 3, 99999]);




// *********************************************************************
//
// *** TEST OBJECTIVE 2 ***
// ** This should succeed with 2 race results running
// Sim #1: Track 101, with drivers [1, 3, 5]
// Sim #2: Track 202, with drivers [1, 3, 5]
// (if ran alone) **
//
// *********************************************************************
// Uncomment ==> 
// app.simulateForAllTracks([101, 202], [1, 3, 5]);



// *********************************************************************
//
// *** TEST OBJECTIVE 3 ***
// ** This should repeatedly simulation the 2 following races
// for 5 seconds, and output a message with aggregate results.
// #1: Track 101, with drivers [1, 3, 5]
// #2: Track 202, with drivers [1, 3, 5]
// (if ran alone).
//
// Example message:
// ****Repeated simulation run results****

//     Total Number of Simulations:                                 5
//     Total Number of races with winners:                          5
//     Total Number of races with 0 winners (all drivers crashed):  0

//     Number of races won per driver:

//    Driver #3 (Camn Driver):                              4
//    Driver #5 (Evyl Driver):                              1
//
// *********************************************************************
// Uncomment ==> 
// app.simulateForAllTracks([101, 202], [1, 3, 5], 5)
//   .then(res => console.log('****Repeated simulation run results****\n', helpers.formatSimsResults(res)))
//   .catch(err => console.log('FAILED CALL:', err));
