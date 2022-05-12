import { Grid, Typography } from "@mui/material";
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
    <Grid container style={{
        border: winner ? "1px solid green" : "",
      }}
    >
      <Grid item xs={3}>
        <img src={option.img} style={{ maxWidth: "100%" }} alt={option.name} />
      </Grid>
      <Grid
        item
        container
        xs={9}
        style={{
          background: vibes(choice.choiceTypes),
          textDecoration: "h"
        }}
      >
        <Grid item xs={12}>
          <Typography
            variant="body1"
            // style={{ color: "white", backgroundColor: "black" }}
          >
            {option.name}
          </Typography>
        </Grid>
      </Grid>
      {breakdown && <Breakdown {...breakdown} style={{ height: "80px" }} />}
    </Grid>
  );
};
