import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertTitle, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import groupthink from "../../client/groupthink";
import { Poll, Ranking } from "../../models";
import { Participant } from "../../components/participant";
import { Option as OptionComponent } from "../../components/option";
import { RankedChoice } from "../../components/ranked-choice";
import { choiceBreakdowns, ChoiceReport } from "../../stats";
import { usePollWithRankings, useRankedChoice } from "../../hooks";

type RankingDisplay = Ranking & { name: string; participantEmail: string };

export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pollId = params.pollId;
  const [participantEmail, setparticipantEmail] = useState(searchParams.get("participantEmail"));

  const poll = usePollWithRankings(pollId);
  const result = useRankedChoice(poll);
  console.log({ poll });
  const [ranking, setRanking] = useState<RankingDisplay | null>(null);

  useEffect(() => {
    setparticipantEmail(searchParams.get("participantEmail"));
  }, [searchParams]);

  useEffect(() => {
    if (!poll) return;
    if (!poll.rankings || poll.rankings.length === 0) return;

    if (participantEmail) {
      const r = poll.rankings.find(r => r.participantEmail === participantEmail);
      if (!r) return;
      const p = poll.participants.find(p => p.email === r.participantEmail);

      setRanking({ ...r, name: p!.name });
    } else {
      setRanking(null);
    }
  }, [setRanking, poll, searchParams, pollId, participantEmail]);

  if (!poll) {
    return <CircularProgress />
  }

  const choices = ranking && ranking.choices;
  const title = ranking?.name ? (
    `${ranking.name}'s ranking`
  ) : (
    <>Final Results</>
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h3">
          {poll.name}
        </Typography>
        <Typography variant="subtitle1">
          by {poll.owner.name}
        </Typography>
        {result?.done ? (
          <Alert severity="success">
            <AlertTitle>Complete</AlertTitle>
            We have a winner{result?.tie && '...s'}!!!
          </Alert>
        ) : (
          <Alert severity="warning">
            <AlertTitle>In progress</AlertTitle>
            We are still wating on {poll.participants.length - (poll.rankings?.length || 0)} participants to submit their votes. The winner so far is...
          </Alert>
        )}
      </Grid>

      <Typography variant="subtitle2">
        {poll.participants.length} participants
      </Typography>
      
      {poll.participants.map(p => {
        const pRanking = poll.rankings?.find(r => r.participantEmail === p.id);
        const action = pRanking && ranking?.participantEmail !== p.id ? {
          cb: () => {
            setSearchParams({
              ...searchParams,
              participantEmail: p.id
            });
          },
          name: `View ${p.name}'s ranking`
        } : undefined;

        return (
          <Participant
            key={p.id}
            participant={p}
            action={action}
            highlight={ranking?.participantEmail === p.id}
          />
        );
      })}

      <Divider />

      {result?.winner ? (
        <>
            <h4>Winner</h4>
            <OptionComponent {...result.winner} />
        </>
      ) : result?.tie ? (
        <>
            <h4>{result.tie.length} way tie</h4>
            {result.tie.map((opt) => <OptionComponent {...opt} /> )}
        </>
      ) : <></>}

      <Typography variant="h5">
        {title}
      </Typography>

      {ranking && poll.result?.done && (
        <Button
          onClick={() => {
            searchParams.delete("participantEmail");
            setSearchParams(searchParams);
          }}
        >
          view results
        </Button>
      )}

      {choices && (
        <ol>
            {choices.map((ch) => <li>{poll.optionsMap[ch.optionId].name}</li>)}
        </ol>
      )}
      
    </Grid>
  )
}
