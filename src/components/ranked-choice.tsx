import { Grid, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";
import { Choice, Option } from "../models";
import { ScoresComponent } from "./scores";

export interface Props {
  option: Option
  choice: Choice;
  winner?: boolean;
}

export const RankedChoice: FunctionComponent<Props> = ({
  choice,
  option,
  winner = false,
}) => {
  

  return (
    <Grid container style={{ border: winner ? "1px solid green" : "" }}>
      <Grid item xs={3}>
        <img src={option.img} style={{ maxWidth: "100%" }} alt={option.name} />
      </Grid>
      <Grid item container xs={9}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{option.name}</Typography>
        </Grid>
        <ScoresComponent scores={choice.choiceTypes} />
      </Grid>
    </Grid>
  );
};
