import { Button, Grid, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";
import { PendingParticipant, Participant as ParticipantModel, VoteStatus } from "../models";
import { Action } from "./action";

export interface Props {
  participant: ParticipantModel | PendingParticipant;
  action?: Action;
  highlight?: boolean;
}

const voteStatusText = (s: VoteStatus): string => {
  switch (s) {
    case VoteStatus.Pending:
      return "Pending";
    case VoteStatus.Notified:
      return "Notified";
    case VoteStatus.InProgress:
      return "In Progress";
    case VoteStatus.Decided:
      return "Voted!";
    case VoteStatus.Error:
      return "ERROR";
  }
}

export const Participant: FunctionComponent<Props> = ({
  participant,
  action,
  highlight
}) => {

  return (
    <Grid container style={{
      border: highlight ? "1px dashed green" : ""
    }}>
      <Grid item xs={12}>
        <Typography variant="body1">
          {participant.name} {action && <Button onClick={action.cb}>{action.name}</Button>}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {participant.phone && (<><Typography variant="subtitle1">Phone:</Typography> {participant.phone} </>)}
      </Grid>
      <Grid item xs={12}>
        {participant.email && (<><Typography variant="subtitle1">Phone:</Typography> {participant.email} </>)}
      </Grid>
      <Grid item xs={12}>
        {voteStatusText(participant.status!)}
      </Grid>
    </Grid>
  );
}
