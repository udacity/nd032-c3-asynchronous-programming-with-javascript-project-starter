export const getDriverLabel = simResult => `Driver #${simResult.winner.id} (${simResult.winner.name})`;
export const formatSimsResults = (results) => {
  /*
    give an aggregate message summarizing stats from all simulation runs
    for example:

      Total Number of Simulations:                                 3
      Total Number of races with winners:                          3
      Total Number of races with 0 winners (all drivers crashed):  0

      Number of races won per driver:

      Driver #3 (Camn Driver):                              2
      Driver #5 (Evyl Driver):                              1
  */

  let totalSims = 0, wonRaces = 0, allDriversCrashedRaces = 0, winnerCounts = {};
  results.forEach(simResult => {
    totalSims += 1;
    if (simResult.winner && simResult.winner.id) {
      // there was a winner
      wonRaces += 1;
      const driverLabel = getDriverLabel(simResult);
      winnerCounts[driverLabel] = (winnerCounts[driverLabel] || 0) + 1;
    } else {
      // there was a race with no winner (everyone crashed)
      allDriversCrashedRaces += 1;
    }
  });
  return `
    Total Number of Simulations:                                 ${totalSims}
    Total Number of races with winners:                          ${wonRaces}
    Total Number of races with 0 winners (all drivers crashed):  ${allDriversCrashedRaces}

    Number of races won per driver:

` + Object.keys(winnerCounts).map(driverLabel =>
`   ${driverLabel}:                              ${winnerCounts[driverLabel]}`).join("\n");
};
