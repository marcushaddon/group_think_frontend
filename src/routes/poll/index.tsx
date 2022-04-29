import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Grid, Typography } from "@mui/material";
import groupthink, { Poll } from "../../client/groupthink";
import { Choice } from "../../models";
import { Participant } from "../../components/participant";
import { RankedOption } from "../../components/ranked-option";

export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const pollId = params.pollId;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [scores, setScores] = useState<{ [optionId: string]: Choice } | null>(null);

  useEffect(() => {
    if (!pollId) return;
    groupthink.getPoll(pollId)
      .then(poll => {
        if (!poll) {
          alert("poll not found");
          return;
        }
        setPoll(poll);

        const ratioMap = poll.result.ratios
          .reduce((dict, score) => ({
            ...dict,
            [score.optionId]: score
          }), {});
        setScores(ratioMap);
      });
    
  }, [pollId]);

  if (!poll) {
    return <CircularProgress />
  }

  const winner = poll.optionsMap[poll.result?.winner?.id];
  const nonWinners = poll.optionsList.filter(o => o.id !== winner?.id);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h1">
          {poll.name}: {poll.result.done ? "DECIDED" : "in progress"}
        </Typography>
        <Typography variant="subtitle1">
          by {poll.ownerName}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {poll.description}
        </Typography>
      </Grid>
      {poll.participants.length} participants
      {poll.participants.map(p => (
        <Participant key={p.id} participant={p} />
      ))}
      {winner && (
        <RankedOption
          key={winner.id}
          option={winner}
          scores={scores?.[winner.id].choiceTypes}
          winner={true}
        />
      )}
      {nonWinners.map(o => (
        <RankedOption
          key={o.id}
          option={o}
          scores={scores?.[o.id].choiceTypes}
        />
      ))}
    </Grid>
  )
}
