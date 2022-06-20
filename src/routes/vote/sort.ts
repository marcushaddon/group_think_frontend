import { assert } from "console";
import { Option } from "../../models";

export type SearchStepResult<T> = {
  choiceA: T;
  choiceB: T;
}

type InsertionIdx = number;
type WinnerId = string | undefined;

export type SortStepResult<T> = SearchStepResult<T> & {
  progress: number;
}

export function* insertIdx<T extends { id: string }>(
  opt: T,
  opts: T[],
  low = 0,
  high = opts.length -1,
): Generator<SearchStepResult<T>, InsertionIdx, WinnerId> {
  if (opts.length === 0) {
    return 0;
  }

  if (low === high) {
    const winner = yield { choiceA: opts[low], choiceB: opt };
    const optIsGT = winner === opt.id;

    if (optIsGT) {
      return low + 1;
    }

    return low;
  }

  const mid = Math.floor((low + high) / 2);
  const candidate = opts[mid];
  const winner = yield { choiceA: opt, choiceB: candidate };
  const optIsGT = winner === opt.id;
  const optIsLT = winner === candidate.id;

  if (optIsGT) {
    const idx = yield* insertIdx(opt, opts, mid + 1, high);
    return idx;
  }

  if (optIsLT) {
    const idx = yield* insertIdx(opt, opts, low, mid) // or mid - 1?
    return idx;
  }

  return mid;
}

export function* insertionSort<T extends { id: string }>(opts: T[]): Generator<SortStepResult<T>, T[], WinnerId> {
  const unsorted = [...opts];
  const sorted: T[] = [];

  let winnerId: WinnerId = undefined;
  while (unsorted.length > 0) {
    const toInsert = unsorted.pop()!;
    const search = insertIdx(toInsert, sorted);
    while (true) {
      const step = search.next(winnerId);
      if (step.done) {
        sorted.splice(step.value, 0, toInsert);
        break;
      } else {
        winnerId = yield { ...step.value, progress: sorted.length / opts.length };
      }
    }
  }

  return sorted.reverse();
}
