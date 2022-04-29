import { Grid, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";
import { Option, Choice } from "../models";
import { ScoresComponent } from "./scores";

export interface Props {
  option: Option;
  scores?: Choice["choiceTypes"];
  winner?: boolean;
}

export const RankedOption: FunctionComponent<Props> = ({
  option,
  scores,
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
        {scores && <ScoresComponent scores={scores} />}
      </Grid>
    </Grid>
  );
};
