import { Alert, Button, Grid, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
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
  const { status } = participant;

  const text = (
    <Typography variant="body1" component={status === VoteStatus.Pending ? "i" : "span"}>
      {participant.name} {action && <Button onClick={action.cb}>{action.name}</Button>}
    </Typography>
  );

  const icon = participant.status === VoteStatus.Decided ? (
    <CheckCircleOutlineIcon color="success" />
  ) : participant.status === VoteStatus.Pending ? (
    <PendingIcon color="info" />
  ) : (
    <span>TODO: handle other statuses</span>
  )

  return (
    <Grid container style={{
      border: highlight ? "1px dashed green" : "",
    }}>
      <Grid item xs={12}>
        {icon} {text}
      </Grid>
    </Grid>
  );
}
