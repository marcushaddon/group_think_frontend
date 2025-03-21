import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertTitle, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import groupthink from "../../client/groupthink";
import { Poll, Ranking } from "../../models";
import { Participant } from "../../components/participant";
import { RankedChoice } from "../../components/ranked-choice";
import { choiceBreakdowns, ChoiceReport } from "../../stats";
import { usePollWithRankings } from "../../hooks";

type RankingDisplay = Ranking & { name: string; participantEmail: string };

export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pollId = params.pollId;
  const [participantEmail, setparticipantEmail] = useState(searchParams.get("participantEmail"));

  const poll = usePollWithRankings(pollId);
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

  const choices = ranking ? ranking.choices : poll.result?.done ? poll.result.ranked! : [];
  const title = ranking?.name ? (
    `${ranking.name}'s ranking`
  ) : (
    <>Final Results</>
  );

  let breakdowns: ChoiceReport | undefined;
  breakdowns = poll.result?.ranked && poll.rankings ? choiceBreakdowns(poll.rankings, poll.result.ranked) : undefined;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h3">
          {poll.name}
        </Typography>
        {poll.result?.done ? (
          <Alert severity="success">
            <AlertTitle>Complete</AlertTitle>
            The results are in! Check them out below...
          </Alert>
        ) : (
          <Alert severity="warning">
            <AlertTitle>In progress</AlertTitle>
            We are still wating on {poll.participants.length - (poll.rankings?.length || 0)} participants to submit their votes
          </Alert>
        )}
        <Typography variant="subtitle1">
          by {poll.owner.name}
        </Typography>
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

      <Typography variant="h5">
        {title}
      </Typography>

      {!poll.result?.done && (
        <>Poll results will be viewable when all participants have submitted.</>
      )}

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

      <ol>
        {choices.map((ch) => <li>{poll.optionsMap[ch.optionId].name}</li>)}
      </ol>
    </Grid>
  )
}
