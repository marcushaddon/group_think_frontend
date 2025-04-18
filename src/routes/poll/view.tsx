import React from "react";
import { RankingGraphLink } from "../ranking";
import {
  Poll,
  VoteStatus,
} from "../../models"; // Adjust path as needed

import {
  ElectionEvent,
} from "../../alg/ranked-choice";
import { useRankedChoice } from "../../hooks";

interface PollDisplayProps {
  poll?: Poll;
}

const asPercent = (p: number) => `${(p * 100).toFixed(2)}%`;

export const PollView: React.FC<PollDisplayProps> = ({ poll }) => {
  const result = useRankedChoice(poll);
  if (!poll) {
    return (
      <div className="flex items-center justify-center h-screen text-center text-gray-700">
        Loading poll data...
      </div>
    );
  }

  const hasVoted = (participantEmail: string) =>
    poll.rankings?.some((r) => r.participantEmail === participantEmail);

  // Determine winner or tie from the Election result
  const winnerOptionId = result?.winner;
  const tiedOptionIds = result?.tie ?? [];

  // Helper to format event logs
  const renderEvent = (event: ElectionEvent, index: number) => {
    const asNames = (optIds: string[]) => optIds.map(
      (id) => poll.optionsMap[id]?.name || `ERROR: unknown option: ${id}`
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
                  {poll.optionsMap[id]?.name ?? id}: {asPercent(share)}
                </li>
              ))}
            </ul>
          </div>
        );
      case "Majority":
        return (
          <div key={index}>
            <strong>Majority Winner:</strong>{" "}
            {poll.optionsMap[event.winner.id]?.name} (
            {asPercent(event.winner.share)})
          </div>
        );
      case "Tie":
        return (
          <div key={index}>
            <strong>Tie Between:</strong>{" "}
            {event.winners.map((id) => poll.optionsMap[id]?.name).join(", ")} (
            share: {asPercent(event.share)})
          </div>
        );
      case "LoserChosen":
        return (
          <div key={index}>
            <strong>Loser Eliminated:</strong>{" "}
            {poll.optionsMap[event.loser]?.name ?? event.loser}
          </div>
        );
      default:
        return <div key={index}>Unknown event</div>;
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto text-black space-y-6">
      <h1 className="text-2xl font-bold">{poll.name}</h1>

      <div>
        <span className="font-semibold">Owner:</span> {poll.owner.name}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">Participants</h2>
        <ul className="space-y-1">
          {poll.participants.map((participant) => (
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
        <ul className="list-disc pl-5">
          {poll.optionsList.map((option) => (
            <li key={option.id}>{option.name}</li>
          ))}
        </ul>
      </div>

      {winnerOptionId && (
        <div className="text-green-700 font-semibold">
          Winner: {poll.optionsMap[winnerOptionId]?.name}
        </div>
      )}

      {tiedOptionIds.length > 0 && (
        <div className="text-yellow-600">
          <div className="font-semibold">Tie between:</div>
          <ul className="list-disc pl-5">
            {tiedOptionIds.map((id) => (
              <li key={id}>{poll.optionsMap[id]?.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-1">Rankings</h2>
        {poll.rankings && poll.rankings.length > 0 ? (
          <ul className="space-y-3">
            {poll.rankings.map((ranking, index) => (
              <li key={index} className="border p-3 rounded">
                <div className="font-medium mb-1">
                  {ranking.participantEmail}
                </div>
                <div className="text-sm text-gray-700">
                  Ranked:
                  <ol className="list-decimal pl-5 mt-1">
                    {ranking.choices.map((choice, i) => (
                      <li key={i}>
                        {poll.optionsMap[choice.optionId]?.name ?? "Unknown"}
                      </li>
                    ))}
                  </ol>
                  <RankingGraphLink ranking={ranking} optMap={poll.optionsMap} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No rankings yet.</div>
        )}
      </div>

      {result?.logs && result.logs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-1">Election Logs</h2>
          <div className="bg-gray-100 p-3 rounded text-sm space-y-2">
            {result.logs.map((event, index) => renderEvent(event, index))}
          </div>
        </div>
      )}
    </div>
  );
};
