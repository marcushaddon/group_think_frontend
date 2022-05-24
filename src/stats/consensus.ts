const stdDev = (vals: number[]): number => {
  const mean = vals.reduce((total, curr) => total + curr) / vals.length;
  return Math.sqrt(
    vals.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / vals.length
  );
};

const repeat = <T>(elem: T, len: number): T[] => 
  [...Array(len)]
    .map(() => elem);

const explode = (placements: number[]): number[] => placements
  .reduce((exploded, count, place) => [...exploded, ...repeat(place, count)], [] as number[]);


export const consensus = (placements: number[]): number => {
  // TODO: can we know the max possible std dev?
  const exploded = explode(placements);
  const dev = stdDev(exploded);
  const count = placements.reduce((total, current) => total + current, 0);
  const polarizedExample = placements
    .map((cout, rank) => rank === 0 ? Math.floor(count / 2) : rank === placements.length - 1 ? Math.ceil(count / 2) : 0);
  const polarizedExploded = explode(polarizedExample);
  const polarizedStdDev = stdDev(polarizedExploded);

  return (polarizedStdDev - dev) / polarizedStdDev;
}

// const evenSplit = [1,1,1,1,1,1,1,1,1,1];
// const polarized = [5, 0,0,0,0,0,0,0,0, 5];
// const lessPolarized = [5, 5, 0,0,0,0,0,0,0,0];
// const grouped = [4, 3, 2, 1, 0,0,0,0,0,0];

// console.log("even split");
// console.log(consensus(evenSplit));
// console.log("polarized")
// console.log(consensus(polarized));
// console.log("less polarized");
// console.log(consensus(lessPolarized));
// console.log("grouped");
// console.log(consensus(grouped));
