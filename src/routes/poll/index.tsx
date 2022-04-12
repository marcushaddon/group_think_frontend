import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Grid, Typography } from "@mui/material";
import groupthink, { Poll } from "../../client/groupthink";
import { Option } from "../../components/option";
import { Participant } from "../../components/participant";

export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const pollId = params.pollId;

  const [poll, setPoll] = useState<Poll | null>(null);
  useEffect(() => {
    if (!pollId) return;
    groupthink.getPoll(pollId)
      .then(poll => setPoll(poll));
    
  }, [pollId]);

  if (!poll) {
    return <CircularProgress />
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h1">
          {poll.name}
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
      {poll.participants.map(p => <Participant participant={p} />)}
      {poll.optionsList.map(o => <Option {...o} />)}
    </Grid>
  )
}
