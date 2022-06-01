import { PendingOption } from "../../models";

const dedupe = <T>(items: T[], getKey: (item: T) => string): T[] => {
  const seen = new Map<string, boolean>();
  const deduped: T[] = [];
  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) {
      continue;
    }
    deduped.push(item);
    seen.set(key, true);
  }

  return deduped;
}

export const merge = <T = undefined>(a: PendingOption<T>, b: PendingOption<T>): PendingOption<T> => {
  const mergedInfoItems = [...(a.infoItems || []), ...(b.infoItems || [])];
  const purgedInfoItems = dedupe(mergedInfoItems, ii => ii.text);

  const merged = {
    ...a,
    ...b,
    infoItems: purgedInfoItems,
  };

  return merged;
}
