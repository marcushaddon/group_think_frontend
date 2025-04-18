import * as logger from "../../common/logging";
import { MatchupResult } from "../../models";

type ID = {
  id: string;
};

export type Matchup<T extends ID> = {
  inserted: T;
  inserting: T;
};

export type MatchupWithProgress<T extends ID> = Matchup<T> & {
  progress: number;
};

enum Relation {
  GT = "GT",
  LT = "LT",
  EQ = "EQ",
}

const matchupKey = (a: ID, b: ID) =>
  [a, b]
    .map(
      (item) =>
        logger.assert(
          !!item?.id,
          `Did not find field 'id' in item for matchupKey`,
          { item },
        ) && item.id,
    )
    .sort()
    .join("_vs_");

export const sorter = () => {
  const comparisons = new Map<string, MatchupResult>();

  const toRelation = (res: MatchupResult, inserting: ID): Relation =>
    res.winnerId === inserting.id
      ? Relation.GT
      : res.winnerId === inserting.id
        ? Relation.LT
        : Relation.EQ;

  function* compare<T extends ID>(
    inserted: T,
    inserting: T,
  ): Generator<Matchup<T>, Relation, MatchupResult> {
    logger.log(`compare: comparing`, { inserted, inserting });
    const key = matchupKey(inserted, inserting);
    const existing = comparisons.get(key);
    if (existing) {
      const relation = toRelation(existing, inserting);
      logger.log(`compare: ${key} existing. result = ${relation}`);

      return relation;
    }

    const matchup: Matchup<T> = {
      inserted,
      inserting,
    };

    const res: MatchupResult = yield matchup;
    comparisons.set(key, res);

    const relation = toRelation(res, inserting);
    logger.log(`compare: got result from user. result = ${relation}`);
    return relation;
  }

  function* binarySearch<T extends ID>(
    items: T[],
    item: T,
    left = 0,
    right = items.length - 1,
  ): Generator<Matchup<T>, T[], MatchupResult> {
    logger.log(
      `binarySearch: left = ${left} right = ${right}, len = ${items.length}`,
      { items },
    );
    if (right <= left) {
      const finalRes = yield* compare(items[left], item);

      const restingPlace = finalRes === Relation.GT ? left + 1 : left;

      const result = [
        ...items.slice(0, restingPlace),
        item,
        ...items.slice(restingPlace),
      ];
      return result;
    }

    // logger.assert(left >= 0 && right < items.length, 'binarySearch: invalid bounds for binary search', {
    //     left,
    //     right,
    //     items,
    //     count: items.length
    // });

    const middle = Math.floor((left + right) / 2);
    logger.log(`binarySearch: middle = ${middle}`);
    const res: Relation = yield* compare(items[left], item);

    if (res === Relation.EQ) {
      const result = [...items.slice(0, middle), item, ...items.slice(middle)];
      logger.log(`binarySearch: found insertion point @ ${middle}`);

      return result;
    }

    const [newLeft, newRight] =
      res === Relation.GT ? [middle + 1, right] : [left, middle - 1];

    return yield* binarySearch(items, item, newLeft, newRight);
  }

  return function* insertionSort<T extends ID>(opts: T[]) {
    let sorted: T[] = [];
    const toSort = [...opts];
    console.log("insertionSort: sorting = ", toSort);
    try {
      while (toSort.length > 0) {
        const toInsert = toSort.pop()!;
        logger.log("sort: inserting", { toInsert, remaining: toSort.length });
        if (sorted.length === 0) {
          sorted.push(toInsert);
          continue;
        }

        sorted = yield* binarySearch(sorted, toInsert);
        logger.log(`sort: inserted ${toInsert.id}`, { sorted });
      }
      logger.log("sort: sort complete", { toSort });

      return [...sorted].reverse();
    } catch (e) {
      const msg =
        e instanceof Error
          ? `name: ${e.name}, cause: ${(e as any).cause}, message: ${e.message}, stack: ${e.stack}`
          : `unknown: ${e}`;
      logger.error("insertionSort: encountered error", {
        error: msg,
      });
      alert("Error during sorter, please export logs");
      throw e;
    }
  };
};
