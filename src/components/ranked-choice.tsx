import { Grid, Typography, Paper } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { FunctionComponent } from "react";
import { Choice, Option } from "../models";
import { ScoresComponent } from "./scores";
import { vibes } from "./gradients";
import { ChoiceBreakdown } from "../stats";
import { VisualBreakdown } from "./visual-breakdown";
import { NLBreakdown } from "./nl-breakdown";

export interface Props {
  option: Option
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
      <Grid
        item
        container
        xs={9}
      >
        {breakdown && breakdownType === "visual" ? (
          <VisualBreakdown {...breakdown} />
        ) : breakdown && breakdownType === "nl" ?
        (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              // style={{ color: "white", backgroundColor: "black" }}
            >
              {winner && <FavoriteIcon color="error" />}
              {option.name}
              {winner && <FavoriteIcon color="error" />}
            </Typography>
            <NLBreakdown {...breakdown} />
            
          </Grid>
        ): (<></>)}
        
      </Grid>
      
    </Grid>
  );
};
