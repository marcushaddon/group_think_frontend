import { Grid, Typography, Paper } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { FunctionComponent } from "react";
import { Choice, Option } from "../models";
import { ScoresComponent } from "./scores";
import { vibes } from "./gradients";
import { ChoiceBreakdown } from "../stats";
import { Breakdown } from "./breakdown";

export interface Props {
  option: Option
  choice: Choice;
  winner?: boolean;
  breakdown?: ChoiceBreakdown;
}

export const RankedChoice: FunctionComponent<Props> = ({
  choice,
  option,
  winner = false,
  breakdown,
}) => {
  

  return (
    <Grid
      container
    >
      <Grid item xs={3}>
        <img src={option.img} style={{ maxWidth: "100%" }} alt={option.name} />
      </Grid>
      <Grid
        item
        container
        xs={9}
        style={{
          textDecoration: "h"
        }}
      >
        <Grid item xs={12}>
          
          <Typography
            variant="body1"
            // style={{ color: "white", backgroundColor: "black" }}
          >
            {winner && <FavoriteIcon color="error" />}
            {option.name}
            {winner && <FavoriteIcon color="error" />}
          </Typography>
          
        </Grid>
      </Grid>
      {breakdown && <Breakdown {...breakdown} style={{  }} />}
    </Grid>
  );
};
