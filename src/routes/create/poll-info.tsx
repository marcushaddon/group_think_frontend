import { Grid, Input, Typography, Button } from "@mui/material";
import React, { FunctionComponent, useCallback, useState } from "react";

export interface Info {
  name: string;
  description: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  expires: string;
}

export interface Props {
  onSubmit: (pi: Info) => void;
}

export const PollInfo: FunctionComponent<Props> = ({
  onSubmit
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [expires, setExpires] = useState(new Date().toISOString());

  const submit = useCallback((event) => {
    (event as any).preventDefault();
    onSubmit({
      name,
      description,
      ownerName,
      ownerPhone,
      expires: new Date(expires).toISOString(),
    });
    setName("");
    setDescription("");
    setOwnerPhone("");
  }, [onSubmit, name, ownerPhone, description, ownerName, expires]);

  return (
    <form onSubmit={submit}>
      <Typography variant="h3">
        Poll Info
      </Typography>
      <Grid container>
        <Grid item xs={12}>
          <Input type="text" required name="name" value={name} placeholder="What is being decided?" onChange={e => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Input type="text" name="description" value={description} placeholder="Additional details" onChange={e => setDescription(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Input type="text" required name="ownerName" value={ownerName} placeholder="Your name" onChange={e => setOwnerName(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Input type="phone" required name="ownerPhone" value={ownerPhone} placeholder="Your phone" onChange={e => setOwnerPhone(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Input type="date" required name="expires" value={expires} onChange={e => setExpires(e.target.value)} />
        </Grid>
        <Button type="submit">
          Continue
        </Button>
      </Grid>
    </form>
  );
}
