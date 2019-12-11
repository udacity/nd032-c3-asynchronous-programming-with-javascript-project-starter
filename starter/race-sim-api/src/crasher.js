const getIfCrashed = () => Math.random(0, 1) * 10000 < 500;

/*

ATTN Graders: test that races successfully terminate if all drivers crash in a race.

test by changing getIfCrashed to `() => true;`

*/

export default getIfCrashed;
