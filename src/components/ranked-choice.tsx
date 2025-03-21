import { Grid } from "@mui/material";
import React, { FunctionComponent } from "react";
import { Choice, Option } from "../models";
import { ChoiceBreakdown } from "../stats";

export interface Props {
  option: Option<any>
  choice: Choice;
  winner?: boolean;
  breakdown?: ChoiceBreakdown;
  breakdownType?: "visual" | "nl";
}

export const RankedChoice: FunctionComponent<Props> = ({
  choice,
  option,
  winner = false,
  breakdown,
  breakdownType = "nl",
}) => {
  

  return (
    <Grid
      container
    >
      <Grid item xs={3}>
        <img src={option.img} style={{ maxWidth: "100%" }} alt={option.name} />
      </Grid>
    </Grid>
  );
};
