import { FunctionComponent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Option as OptionComponent } from "../../components/option";
import { usePollWithRankings, useRankedChoice } from "../../hooks";
import { ElectionBreakdown } from "./election-breakdwon";


export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const pollId = params.pollId;

  const poll = usePollWithRankings(pollId);
  const result = useRankedChoice(poll);

  const done = poll?.rankings?.length === poll?.participants.length;

  if (!poll) {
    return <>TODO: progress</>;
  }

  return (
    <div>
      <div>
        <h3>{poll.name}</h3>
        <small>by {poll.owner.name}</small>
        {done ? (
          <div>
            <div>Complete</div>
            We have a winner{Array.isArray(result?.tie) && "...s"}!!!
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
          <OptionComponent {...poll.optionsMap[result.winner]} />
        </>
      ) : result?.tie ? (
        <>
          <h4>{result.tie.length} way tie</h4>
          {result.tie.map((opt) => (
            <OptionComponent {...poll.optionsMap[opt]} />
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
                        {ranking.choices.map((ch) => {
                            const name = poll.optionsMap[ch.optionId].name;
                            return <li>{name || `Couldn't find option ${ch.optionId}`}</li>;
                        })}
                    </ol>
                    <hr />
                </>
            );
        }

        return <>wating on {p.name} to vote!</>
      })}

      {result?.logs.length && (
        <ElectionBreakdown events={result.logs} getOption={(optionId ) => poll.optionsMap[optionId] }/>
      )}
    </div>
  );
};
