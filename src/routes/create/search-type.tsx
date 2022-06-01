import { Button, Grid } from "@mui/material";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { SearchType } from "./create";

export interface Props {
  onSelectSearchType: (st: SearchType) => void;
}

export const SelectSearchType: FunctionComponent<Props> = ({
  onSelectSearchType
}) => (
  // TODO: replace this with better mui component 
  <Grid container>
    <Grid item xs={12}>
      <h3>
        What are you trying to decide on?
      </h3>
    </Grid>
    <Grid item xs={12}>
      <Button
        onClick={() => onSelectSearchType(SearchType.PLACES)}
      >
        Places (restaurants, etc...)
      </Button>
    </Grid>
    <Grid item xs={12}>
      <Button
        onClick={() => onSelectSearchType(SearchType.GOOGLE)}
      >
        General
      </Button> 
    </Grid>
  </Grid>
);
