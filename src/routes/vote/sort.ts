import { assert } from "console";
import { appendFileSync } from "fs";
import { Option } from "../../models";

export type SearchStepResult = {
  choiceA: Option;
  choiceB: Option;
}

type InsertionIdx = number;
type WinnerId = string | undefined;

export type SortStepResult = SearchStepResult & {
  progress: number;
}

const log = (...msg: any[]) => { 
  console.log("INSERT IDX:", ...msg);
  appendFileSync("./sort.log", msg.join("") + "\n");
};

export function* insertIdx(
  opt: Option,
  opts: Option[],
  low = 0,
  high = opts.length -1
): Generator<SearchStepResult, InsertionIdx, WinnerId> {
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



