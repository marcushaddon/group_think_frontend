type Radians = number;
type Vec2 = [number, number];

const calcVec2 = (angleA: Radians, hypotenuse: number): Vec2 => {
  const angleB = 90 - angleA;

  const x = hypotenuse * Math.sin(angleB);
  const y = hypotenuse * Math.sin(angleA);

  return [x, y];
};

const split180 = (places: number): Radians[] => {
  const step = Math.PI / places;

  return [...Array(places)]
    .map((_, i) => i * step);
}

const stdDev = (vals: number[]): number => {
  const mean = vals.reduce((total, curr) => total + curr) / vals.length;
  return Math.sqrt(
    vals.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / vals.length
  );
};

const consensus = (placements: number[]): number => {
  // TODO: can we know the max possible std dev?
  const angs = split180(placements.length);
  console.log({ angs });

  const nonZeroPlacementIdxs = placements
    .map((_, i) => i)
    .filter(idx => placements[idx] > 0);
  const nonZeroAngs = nonZeroPlacementIdxs
    .map(idx => angs[idx]);
  
  const rays = nonZeroPlacementIdxs
    .map(idx => angs[idx] * placements[idx]);
  
  // console.log({ rays });
  
  const vectors = rays
    .map((ray, idx) => calcVec2(nonZeroAngs[idx], ray));

  // console.log({ vectors });

  const summed = vectors
    .reduce(([s1, s2], [v1, v2]) => [s1 + v1, s2 + v2], [0,0]);

  // console.log({ summed });

  // return Math.sqrt(Math.pow(summed[0], 2) + Math.pow(summed[1], 2));
  return summed[0];
}

const evenSplit = [1,1,1,1,1,1,1,1,1,1];
const polarized = [5, 0,0,0,0,0,0,0,0, 5];
const lessPolarized = [5, 5, 0,0,0,0,0,0,0,0];
const grouped = [4, 3, 2, 1, 0,0,0,0,0,0];

console.log("even split");
console.log(consensus(evenSplit));
console.log("polarized")
console.log(consensus(polarized));
console.log("less polarized");
console.log(consensus(lessPolarized));
console.log("grouped");
console.log(consensus(grouped));
