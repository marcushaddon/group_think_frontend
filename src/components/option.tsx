import React, { FunctionComponent, useCallback } from "react";
import { Grid, Typography, Link, Button } from "@mui/material";
import { Option as OptionProps } from "../models";

export interface Swipeable {
  onSelect?: () => void;
  onReject?: () => void;
}

export const Option: FunctionComponent<OptionProps & Swipeable> = ({
  name,
  img,
  uri,
  description,
  onSelect,
  onReject,
}) => {

  return (
    <Grid container>
      <Grid item container xs={12}>
          <img style={{ width: "100%" }} src={img} alt={name} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {name}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
        </Grid>
      <Grid item xs={12}>
        <Link href={uri} target="_blank">More</Link>
        {onSelect && (
          <Button onClick={onSelect}>Select</Button>
        )}
        {onReject && (
          <Button onClick={onReject}>Reject</Button>
        )}
      </Grid>
    </Grid>
  );
}
