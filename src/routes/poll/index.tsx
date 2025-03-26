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
  const [participantEmail, setparticipantEmail] = useState(
    searchParams.get("participantEmail"),
  );

  const poll = usePollWithRankings(pollId);
  const result = useRankedChoice(poll);

  const [ranking, setRanking] = useState<RankingDisplay | null>(null);

  useEffect(() => {
    setparticipantEmail(searchParams.get("participantEmail"));
  }, [searchParams]);

  useEffect(() => {
    if (!poll) return;
    if (!poll.rankings || poll.rankings.length === 0) return;

    if (participantEmail) {
      const r = poll.rankings.find(
        (r) => r.participantEmail === participantEmail,
      );
      if (!r) return;
      const p = poll.participants.find((p) => p.email === r.participantEmail);

      setRanking({ ...r, name: p!.name });
    } else {
      setRanking(null);
    }
  }, [setRanking, poll, searchParams, pollId, participantEmail]);

  if (!poll) {
    return <>TODO: progress</>;
  }

  const choices = ranking && ranking.choices;
  const title = ranking?.name ? (
    `${ranking.name}'s ranking`
  ) : (
    <>Final Results</>
  );

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

      {poll.participants.map((p) => {
        const pRanking = poll.rankings?.find(
          (r) => r.participantEmail === p.id,
        );
        const action =
          pRanking && ranking?.participantEmail !== p.id
            ? {
                cb: () => {
                  setSearchParams({
                    ...searchParams,
                    participantEmail: p.id,
                  });
                },
                name: `View ${p.name}'s ranking`,
              }
            : undefined;

        return (
          <Participant
            key={p.id}
            participant={p}
            action={action}
            highlight={ranking?.participantEmail === p.id}
          />
        );
      })}

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

      <h5>{title}</h5>

      {ranking && poll.result?.done && (
        <button
          onClick={() => {
            searchParams.delete("participantEmail");
            setSearchParams(searchParams);
          }}
        >
          view results
        </button>
      )}

      {choices && (
        <ol>
          {choices.map((ch) => (
            <li>{poll.optionsMap[ch.optionId].name}</li>
          ))}
        </ol>
      )}
    </div>
  );
};
