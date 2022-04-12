import { Grid, Typography, Input, Button } from "@mui/material";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Participant } from "../../components/participant";
import { Participant as ParticipantModel, VoteStatus } from "../../models";

export interface Props {
  participants: ParticipantModel[];
  onAddParticipant: (p: ParticipantModel) => void;
  onComplete: () => void;
}

export const Participants: FunctionComponent<Props> = ({
  onComplete,
  onAddParticipant,
  participants
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = useCallback((e) => {
    (e as any).preventDefault();
    onAddParticipant({
      name,
      phone,
      status: VoteStatus.Pending,
    });
    setName("");
    setPhone("");
  }, [name, phone, onAddParticipant]);

  return (
    <form onSubmit={submit}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3">
            Add participants
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Input type="text" required placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Input type="tel" required placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit">Add</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            {participants.length} participants
          </Typography>
          {participants.map(p => <Participant participant={p} />)}
        </Grid>
        <Button onClick={onComplete}>Next</Button>
      </Grid>
    </form>
  );
}
