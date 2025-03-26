import { FunctionComponent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Ranking } from "../../models";
import { Participant } from "../../components/participant";
import { Option as OptionComponent } from "../../components/option";
import { usePollWithRankings, useRankedChoice } from "../../hooks";

type RankingDisplay = Ranking & { name: string; participantEmail: string };

export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pollId = params.pollId;

  const poll = usePollWithRankings(pollId);
  const result = useRankedChoice(poll);

  if (!poll) {
    return <>TODO: progress</>;
  }

  return (
    <div>
      <div>
        <h3>{poll.name}</h3>
        <small>by {poll.owner.name}</small>
        {result?.done ? (
          <div>
            <div>Complete</div>
            We have a winner{result?.tie && "...s"}!!!
          </div>
        ) : (
          <div>
            <div>In progress</div>
            We are still wating on{" "}
            {poll.participants.length - (poll.rankings?.length || 0)}{" "}
            participants to submit their votes. The winner so far is...
          </div>
        )}
      </div>

      <>{poll.participants.length} participants</>

      <hr />

      {result?.winner ? (
        <>
          <h4>Winner</h4>
          <OptionComponent {...result.winner} />
        </>
      ) : result?.tie ? (
        <>
          <h4>{result.tie.length} way tie</h4>
          {result.tie.map((opt) => (
            <OptionComponent {...opt} />
          ))}
        </>
      ) : (
        <></>
      )}

      {poll.participants.map((p) => {
        const ranking = poll.rankings?.find((r) => r.participantEmail === p.email);
        if (ranking) {
            return (
                <>
                    {p.name}'s ranking
                    <ol>
                        {ranking.choices.map((ch) => <li>{ch.optionId}</li>)}
                    </ol>
                    <hr />
                </>
            );
        }

        return <>wating on {p.name} to vote!</>
      })}
    </div>
  );
};
