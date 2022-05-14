import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertTitle, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import groupthink from "../../client/groupthink";
import { Choice, Poll, Ranking } from "../../models";
import { Participant } from "../../components/participant";
import { RankedChoice } from "../../components/ranked-choice";
import { choiceBreakdowns, ChoiceReport } from "../../stats";

type RankingDisplay = Ranking & { name: string; participantId: string };

export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pollId = params.pollId;
  const [participantId, setParticipantId] = useState(searchParams.get("participantId"));

  const [poll, setPoll] = useState<Poll | null>(null);
  const [ranking, setRanking] = useState<RankingDisplay | null>(null);
  const [viewBreakdown, setViewBreakdown] = useState(false);

  useEffect(() => {
    setParticipantId(searchParams.get("participantId"));
  }, [searchParams]);

  useEffect(() => {
    if (!poll) return;
    if (!poll.rankings || poll.rankings.length === 0) return;

    if (participantId) {
      const r = poll.rankings.find(r => r.participantId === participantId);
      if (!r) return;
      const p = poll.participants.find(p => p.id === r.participantId);

      setRanking({ ...r, name: p!.name });
    } else {
      setRanking(null);
    }
  }, [setRanking, poll, searchParams, pollId, participantId]);

  useEffect(() => {
    if (!pollId) return;

    groupthink.getPoll(pollId)
      .then(poll => {
        if (!poll) {
          alert("poll not found");
          return;
        }
        setPoll(poll);
      });
    
  }, [pollId]);

  if (!poll) {
    return <CircularProgress />
  }

  const choices = ranking ? ranking.choices : poll.result.done ? poll.result.ranked! : [];
  const title = ranking?.name ? (
    `${ranking.name}'s ranking`
  ) : (
    <>Final Results</>
  );

  let breakdowns: ChoiceReport | undefined;
  breakdowns = poll.result.ranked ? choiceBreakdowns(poll.rankings, poll.result.ranked) : undefined;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h3">
          {poll.name}
        </Typography>
        {poll.result.done ? (
          <Alert severity="success">
            <AlertTitle>Complete</AlertTitle>
            The results are in! Check them out below...
          </Alert>
        ) : (
          <Alert severity="warning">
            <AlertTitle>In progress</AlertTitle>
            We are still wating on {poll.participants.length - poll.rankings.length} participants to submit their votes
          </Alert>
        )}
        <Typography variant="subtitle1">
          by {poll.ownerName}
        </Typography>
      </Grid>

      <Typography variant="subtitle2">
        {poll.participants.length} participants
      </Typography>
      
      {poll.participants.map(p => {
        const pRanking = poll.rankings.find(r => r.participantId === p.id);
        const action = pRanking && ranking?.participantId !== p.id ? {
          cb: () => {
            setSearchParams({
              ...searchParams,
              participantId: p.id
            });
          },
          name: `View ${p.name}'s ranking`
        } : undefined;

        return (
          <Participant
            key={p.id}
            participant={p}
            action={action}
            highlight={ranking?.participantId === p.id}
          />
        );
      })}

      <Divider />

      <Typography variant="h3">
        {title}
      </Typography>

      {!poll.result.done && (
        <>Poll results will be viewable when all participants have submitted.</>
      )}

      {ranking && poll.result.done && (
        <Button
          onClick={() => {
            searchParams.delete("participantId");
            setSearchParams(searchParams);
          }}
        >
          view results
        </Button>
      )}

      <Button
        variant={viewBreakdown ? "outlined" : "contained"}
        onClick={() => setViewBreakdown(!viewBreakdown)}
      >
        {viewBreakdown ? "Hide breakdown" : "Show breakdown"}
      </Button>

      {choices.map((ch, i) => (
        <RankedChoice
          key={ch.optionId}
          option={poll.optionsMap[ch.optionId]}
          choice={ch}
          winner={i === 0}
          breakdown={breakdowns?.[ch.optionId]}
          viewBreakdown={viewBreakdown}
        />
      ))}
    </Grid>
  )
}
