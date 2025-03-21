type Option = { id: string };

export const rankedChoice = <T extends Option>(rankings: T[][]): string | string[] => {
    let workingRankings = [...rankings];
    while (true) {
        console.log('top of loop', workingRankings);
        // TODO: if we have a tie
        const scores = firstPlaceShares(workingRankings);
        console.log('scores', scores);
        // 1st shares = shares(rankings)
        const results = superlatives(scores);
        console.log('results', results);
        console.log()

        const weHaveATie = results.winners && results.winners.length === workingRankings.length;
        console.log({ weHaveATie, remainingOpts: workingRankings[0].length });
        if (weHaveATie) {
            return results.winners.map(([ id ]) => id)
        }
        // winner = shares where s > 0.5
        const winner = results.winner;
        const share = results.winner ? results.winner[1] / workingRankings.length : 0;

        console.log('winner?', { winner, share });

        // if winner return winner
        if (winner && share > 0.5) {
            console.log('we have a winner');
            return results.winner[0];
        }
        // loser = find loser
        // rankings = filter(loser)
        console.log('first choices before filtering', results.loser[0], workingRankings.map(r => r[0]));
        workingRankings = workingRankings.map(
            (ranking) => ranking.filter((opt) => opt.id !== results.loser[0])
        );
        console.log('working rankings after filter', workingRankings.map(r => r[0]));

    }
}

const firstPlaceShares = (
    rs: Option[][]
): Record<string, number> => rs.reduce((counts, current) => ({
    ...counts,
    [current[0].id]: (counts[current[0].id] || 0) + 1
}), {});

type Highest = {
    winner: [string, number],
    winners: undefined
} | {
    winner: undefined,
    winners: [string, number][]
};
type Lowest = {
    loser: [string, number]
}

type Superlatives = Highest & Lowest;

// vsWinner
const vsWinner = (
    [highId, highScore]: [string, number],
    [vsId, vsScore]: [string, number]
): Highest => 
    vsScore > highScore ? { winner: [vsId, vsScore ], winners: undefined } :
    vsScore < highScore ? { winner: [highId, highScore ], winners: undefined } :
    { winners: [[highId, highScore], [vsId, vsScore ] ], winner: undefined};
// vsWinners
const vsWinners = (
    winners: [string, number][],
    [vsId, vsScore]: [string, number]
): Highest =>
    winners.every(([, score]) => vsScore < score) ? { winners, winner: undefined } :
    winners.every(([, score]) => vsScore === score) ? {
        winners: [...winners, [ vsId, vsScore ] ],
        winner: undefined
    } : { winner: [ vsId, vsScore ], winners: undefined };

const winner = (sups: Superlatives, contender: [string, number]) =>
    sups.winner ? vsWinner(sups.winner, contender) :
    vsWinners(sups.winners, contender);

const loser = (
    [lowId, lowScore]: [string, number],
    [vId, vScore]: [string, number]
): Lowest =>
    vScore < lowScore ? { loser: [vId, vScore] } : { loser: [lowId, lowScore ] };

const superlatives = (shares: Record<string, number>) => Object.entries(shares)
    .reduce(
        (res, [current, score]) => ({
            ...winner(res, [current, score]),
            ...loser(res.loser, [current, score])
        }),
        { winner: ["", -Infinity],
        loser: ["", Infinity]
        } as Superlatives
    );