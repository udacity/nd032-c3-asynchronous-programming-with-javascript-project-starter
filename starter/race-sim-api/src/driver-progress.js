// DO NOT EDIT

const getDriverProgress = (driverId, raceSecond) => {
  switch (driverId) {
    case 1:
      return 5;
    case 2:
      return Math.round(Math.random() * 5 * raceSecond);
    case 3:
      return Math.round(Math.random() * 5 * raceSecond);
    default:
      return Math.round(Math.random() * 15);
  }
};

export default getDriverProgress;
