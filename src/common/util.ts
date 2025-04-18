export const isSubsetOf = (a: Set<any>, b: Set<any>): boolean =>
  [...a.values()].every((v) => b.has(v));
