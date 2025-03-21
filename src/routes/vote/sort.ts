import { assert } from "console";
import { Option } from "../../models";
import { MatchupResult } from ".";

type ID = { 
    id: string;
}

export type Matchup<T extends ID> = {
  inserted: T;
  inserting: T;
}

export type MatchupWithProgress<T extends ID> = Matchup<T> & {
  progress: number;
}

enum Relation {
    GT = "GT",
    LT = "LT",
    EQ = "EQ"
}

const matchupKey = (a: ID, b: ID) =>
    [a, b].map(({ id }) => id).sort().join('_vs_');

export const sorter = () => {
    const comparisons = new Map<string, MatchupResult>();

    const toRelation = (res: MatchupResult, inserting: ID): Relation =>
        res.winnerId === inserting.id ? Relation.GT :
            res.winnerId === inserting.id ? Relation.LT :
            Relation.EQ;

    function* compare<T extends ID>(inserted: T, inserting: T) {
        const key = matchupKey(inserted, inserting);
        debugger;
        const existing = comparisons.get(key);
        if (existing) {
            debugger;
            return toRelation(existing, inserting);
        }

        const matchup: Matchup<T> = {
            inserted,
            inserting
        };
    
        debugger;
        const res: MatchupResult = yield matchup;
        debugger;
        comparisons.set(key, res);
    
        return toRelation(res, inserting);
    }
    
    function* binarySearch<T extends ID>(
        items: T[],
        item: T,
        left = 0,
        right = items.length
    ): Generator<Matchup<T>, T[], MatchupResult> {
        debugger;
        if (right <= left) {
            debugger;
            const finalRes = yield* compare(item, items[left]);
            
            const restingPlace = (finalRes === Relation.GT) ?
                (left + 1) : left;
            debugger;
            
            const result = [...items.slice(0, restingPlace), item, ...items.slice(restingPlace)];
            return result;
        }
    
        const middle = Math.floor((left + right) / 2);
        debugger;
        const res: Relation = yield* compare(items[left], item);
        
        if (res === Relation.EQ) {
            debugger;
            const result = [...items.slice(0, middle), item, ...items.slice(middle)];
            return result;
        }
    
        const [newLeft, newRight] = res === Relation.GT ?
            [middle + 1, right] : [left, middle - 1];
        debugger;
    
        yield* binarySearch(items, item, newLeft, newRight);
        throw new Error('ASSERTION: UNREACHABLE');
    }
    
    return function* insertionSort<T extends ID>(opts: T[]) {
        let sorted: T[] = [];
        const toSort = [...opts].sort(() => Math.random() > 0.5 ? 1 : -1);
        console.log('insertionSort: toSort = ', toSort);
        debugger;
    
        while (toSort.length > 0) {
            const toInsert = toSort.pop()!;
            console.log('sort: inserting', toInsert, 'remaining = ', toSort.length);
            if (sorted.length === 0) {
                sorted.push(toInsert);
                continue;
            }
    
            debugger;
            sorted = yield* binarySearch(sorted, toInsert);
            debugger;
            console.log(`sort: inserted ${toInsert.id}, sorted = `, sorted)
        }
        console.log('sort: sort complete', toSort);
    
        return sorted;
    }
}

