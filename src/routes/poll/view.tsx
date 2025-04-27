import React, { FunctionComponent } from "react";
import { RankingGraphLink } from "../ranking";
import {
  Choice,
  Election,
  MatchupAward,
  MatchupResult,
  Ranking,
} from "../../models"; // Adjust path as needed

import {
  ElectionEvent,
} from "../../alg/ranked-choice";
import { useResult } from "../../hooks";
import { CondorcetMatrix } from "./matrix";

interface PollDisplayProps {
  election?: Election;
}

const asPercent = (p: number) => `${(p * 100).toFixed(2)}%`;


const matchupKey = (a: string, b: string) => [a, b].sort().join('_');
const tieAwards = new Set([MatchupAward.AMBIVALENT_TIE, MatchupAward.NEGATIVE_TIE, MatchupAward.POSITIVE_TIE]);
const isTie = (award: MatchupAward): boolean => tieAwards.has(award);

const rankingStyles = (ranking: Ranking): (React.CSSProperties & { arrow: string })[] => {
  const matchups = ranking.matchups.reduce((map, current) => ({
    ...map,
    [matchupKey(current.candidateA, current.candidateB)]: current
  }), {} as Record<string, MatchupResult>);

  const grouped = ranking.choices.reduce(
    (groups, current, i) => {
      const res = i > 0 ? 
        matchups[matchupKey(current.candidateId, ranking.choices[i - 1].candidateId)] :
        undefined;
      const tiedWithAbove = !!res?.winnerAward && isTie(res.winnerAward);

      return tiedWithAbove ? [
        ...groups.slice(0, -1),
        [...groups.at(-1)!, current]
      ] : [
        ...groups,
        [current]
      ]
    },
    [] as Choice[][]
  );

  const len = grouped.length;
  
  const hues = grouped.map((ch, i) => {
    const hue = 120 / grouped.length * (len - i - 1);

    return hue;
  });

  const UP_ARROW = "\u2191";
  const DOWN_ARROW = "\u2193";
  const UPDOWN_ARROW = "\u2195";

  /**
   * BOOKMARK: include unicode arrows indicating comparisons
   * UPWARDS ARROW, U+2191 &#x2191;
   * DOWNWARDS ARROW, U+2193 &#x2193;
   * UP DOWN ARROW, U+2195 &#x2195;
   */

  const styles = grouped.flatMap(
    (group, gIdx) => group.map((choice, chIdx) => {
        const hue = hues[gIdx];
        const tiedWithPrev = chIdx > 0;
        const tiedWithNext = chIdx < group.length - 1;

        const bgHsl = `hsl(${hue}, 50%, 80%)`;
        const borderHsl = `hsl(${hue}, 50%, 60%)`;

        return {
            backgroundColor: bgHsl,
            borderLeft: `1px solid ${borderHsl}`,
            borderRight: `1px solid ${borderHsl}`,
            borderTop: `1px solid ${tiedWithPrev ? bgHsl : borderHsl}`,
            borderBottom: `1px solid ${tiedWithNext ? bgHsl : borderHsl}`
        }
    })
  );

  const arrows = ranking.choices.map(({ candidateId }, i) => {
    const above = ranking.choices[i - 1]?.candidateId;
    const below = ranking.choices[i + 1]?.candidateId;

    const comparedWithAbove = !!matchups[matchupKey(candidateId, above)];
    const comparedWithBelow = !!matchups[matchupKey(candidateId, below)];

    return comparedWithAbove && comparedWithBelow ? 
        UPDOWN_ARROW : 
        comparedWithAbove ? UP_ARROW :
        comparedWithBelow ? DOWN_ARROW : '';
  });

  return styles.map((style, i) => ({ ...style, arrow: arrows[i]}));
}

const VoterRanking: FunctionComponent<{ ranking: Ranking, election: Election }> = ({
  ranking,
  election
}) => {
  const styles = rankingStyles(ranking);

  return (
    <>
      <div className="font-medium mb-1">
        {ranking.voterEmail}
      </div>
      <div className="text-sm text-gray-700">
        Ranked:
        <ol className="list-decimal pl-5 mt-1">
          {ranking.choices.map((choice, i) => (
            <li key={i} style={{ ...styles[i] }}>
              {styles[i].arrow} {election.candidateMap[choice.candidateId]?.name ?? "Unknown"}
            </li>
          ))}
        </ol>
        <RankingGraphLink ranking={ranking} optMap={election.candidateMap} />
      </div>

    </>
  )
}

export const PollView: React.FC<PollDisplayProps> = ({ election }) => {
const result = useResult(election);
  if (!election) {
    return (
      <div className="flex items-center justify-center h-screen text-center text-gray-700">
        Loading poll data...
      </div>
    );
  }

  const hasVoted = (participantEmail: string) =>
    election.rankings?.some((r) => r.voterEmail === participantEmail);

  // Helper to format event logs
  const renderEvent = (event: ElectionEvent, index: number) => {
    const asNames = (optIds: string[]) => optIds.map(
      (id) => election.candidateMap[id]?.name || `ERROR: unknown option: ${id}`
    ).join(", ");
    switch (event.name) {
      case "Round":
        return (
          <div key={index}>
            <strong>Round:</strong> {asNames(event.options)}
          </div>
        );
      case "FirstPlaceShares":
        return (
          <div key={index}>
            <strong>First Place Shares:</strong>
            <ul className="list-disc pl-5">
              {Object.entries(event.shares).map(([id, share]) => (
                <li key={id}>
                  {election.candidateMap[id]?.name ?? id}: {share}
                </li>
              ))}
            </ul>
          </div>
        );
      case "Majority":
        return (
          <div key={index}>
            <strong>Majority Winner:</strong>{" "}
            {election.candidateMap[event.winner.id]?.name} (
            {asPercent(event.winner.share)})
          </div>
        );
      case "Tie":
        return (
          <div key={index}>
            <strong>Tie Between:</strong>{" "}
            {event.winners.map((id) => election.candidateMap[id]?.name).join(", ")} (
            share: {asPercent(event.share)})
          </div>
        );
      case "LoserChosen":
        return (
          <div key={index}>
            <strong>Loser Eliminated:</strong>{" "}
            {election.candidateMap[event.loser]?.name ?? event.loser}
          </div>
        );
      default:
        return <div key={index}>Unknown event</div>;
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto text-black space-y-6">
      <h1 className="text-2xl font-bold">{election.name}</h1>

      <div>
        <span className="font-semibold">Owner:</span> {election.owner.name}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">Participants</h2>
        <ul className="space-y-1">
          {election.voters.map((participant) => (
            <li
              key={participant.id}
              className={`flex items-center justify-between border-b pb-1 ${
                hasVoted(participant.email)
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {participant.name}
              <span className="text-sm">
                {hasVoted(participant.email) ? "Voted ✅" : "Not Voted ❌"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">Options</h2>
        <ul className="list-decimal pl-5">
          {election.candidateList.map((option) => (
            <li key={option.id}>{option.name}</li>
          ))}
        </ul>
      </div>

      {/* AVERAGE RANKING */}
      {/* TODO: show distribution! */}

      <div>
        <h2 className="text-lg font-semibold mb-1">Average ranking result</h2>
      </div>

      {result?.avg?.value?.winner && (
        <div className="text-green-700 font-semibold">
          Winner: {election.candidateMap[result?.avg.value.winner]?.name} (avg. ranking of {(result?.avg.value.share + 1).toFixed(2)})
        </div>
      )}

      {result.avg?.value?.tie?.length && (
        <div className="text-yellow-600">
          Tied with average rankings of {(result?.avg.value.share + 1).toFixed(2)}
          <div className="font-semibold">Tie between:</div>
          <ul className="list-disc pl-5">
            {result?.avg.value.tie.map((id) => (
              <li key={id}>{election.candidateMap[id]?.name}</li>
            ))}
          </ul>
        </div>
      )}

      {result.avg?.value?.shares && (
        <ol
            className="list-decimal pl-5"
        >
            {
                Object.entries(result.avg.value.shares)
                    .sort((a, b) => a[1] < b[1] ? -1 : 1)
                    .map(([id, placement], i) => (
                        <li
                            className={
                                (id === result.avg.value?.winner ?
                                    "text-green-700 font-semibold" : result.avg.value?.tie?.includes(id) ?
                                    "text-yellow-600" :
                                    "")
                                }
                        >
                            {election.candidateMap[id].name}: {(placement + 1).toFixed(2)}
                        </li>
                    ))
            }
        </ol>
      )}

      {/* RANKED CHOICE */}

      <div>
        <h2 className="text-lg font-semibold mb-1">Ranked Choice (Instant runnoff) Results</h2>
      </div>

      {result?.rcv?.error && (
        <div className="text-red-700 font-semibold">
          Error computing RCV result: {result.rcv.error.name}: {result.rcv.error.message}
        </div>
      )}

      {result?.rcv?.value?.winner && (
        <div className="text-green-700 font-semibold">
          Winner: {election.candidateMap[result?.rcv.value.winner]?.name}
        </div>
      )}

      {result?.rcv?.value?.tie?.length && (
        <div className="text-yellow-600">
          <div className="font-semibold">Tie between:</div>
          <ul className="list-disc pl-5">
            {result?.rcv?.value.tie.map((id) => (
              <li key={id}>{election.candidateMap[id]?.name}</li>
            ))}
          </ul>
        </div>
      )}

      {result?.rcv?.value?.logs && result?.rcv.value.logs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-1">Ranked Choice Election Logs</h2>
          <div className="bg-gray-100 p-3 rounded text-sm space-y-2">
            {result?.rcv.value.logs.map((event, index) => renderEvent(event, index))}
          </div>
        </div>
      )}

      {/* CONDORCET */}
      <div>
        <h2 className="text-lg font-semibold mb-1">Ranked Choice (Condorcet) Results</h2>
      </div>

      {result?.condorcetMethod?.error && (
        <div className="text-red-700 font-semibold">
          Error computing Condorset result: {result.condorcetMethod.error.name}: {result.condorcetMethod.error.message}
        </div>
      )}

      {result?.condorcetMethod?.value?.winner && (
        <div className="text-green-700 font-semibold">
          Winner: {election.candidateMap[result?.condorcetMethod.value.winner]?.name}
        </div>
      )}

      {result?.condorcetMethod?.value?.matrix && (
        <CondorcetMatrix
            candidates={election.candidateList}
            matrix={result.condorcetMethod.value.matrix}
        />
      )}

      {result?.condorcetMethod?.value?.tie?.length && (
        <div className="text-yellow-600">
          <div className="font-semibold">Tie between:</div>
          <ul className="list-disc pl-5">
            {result?.condorcetMethod?.value.tie.map((id) => (
              <li key={id}>{election.candidateMap[id]?.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-1">Rankings</h2>
        {election.rankings && election.rankings.length > 0 ? (
          <ul className="space-y-3">
            {election.rankings.map((ranking, index) => (
              <li key={index} className="border p-3 rounded">
                <VoterRanking ranking={ranking} election={election} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No rankings yet.</div>
        )}
      </div>

    </div>
  );
};
