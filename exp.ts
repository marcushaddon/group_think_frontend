type StepResult = {
  choiceA: number;
  choiceB: number;
}

function* binarySearch(items: number[], item: number): Generator<StepResult, number, -1 | 0 | 1> {
  let l = 0;
  let r = items.length;

  if (r === 0) { return 0 };

  while (l < r) {
    const mid = Math.floor((l + r) / 2);
    const res = yield { choiceA: items[mid], choiceB: item };

    if (res === 0) {
      return mid;
    }

    if (res === -1) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }

  console.assert(l === r);

  return items[l] < item ? l + 1 : l;
}

function* insertionSort(unsorted: number[]): Generator<StepResult, number[], -1 | 0 | 1> {
  const sorted: number[] = [];
  while (unsorted.length > 0) {
    const next = unsorted.pop();
    const idx = yield* binarySearch(sorted, next as number);
    sorted.splice(idx, 0, next as number);
  }

  return sorted;
}

const bin = insertionSort([1,2,3,4,5].sort(() => Math.random() > 0.5 ? -1 : 1));
let input: -1 | 0 | 1 = 0;
let i = 0;
while (i++ < 10) {
  const choices = bin.next(input);
  console.log({ choices });
  if (choices.done) {
    break;
  }
  choices.value = choices.value as StepResult;

  if (choices.value.choiceA === choices.value.choiceB) {
    input = 0
  } else if (choices.value.choiceA < choices.value.choiceB) {
    input = -1;
  } else {
    input = 1;
  }
}



// const sorted = [1,2,3,4,5,6,7,974,6,8.8].sort();
// const unsorted = [...sorted].sort(() => Math.random() > 0.5 ? -1 : 1);
// console.log({ sorted, unsorted });
// console.assert(binarySort(unsorted).join("") === sorted.join(""))
