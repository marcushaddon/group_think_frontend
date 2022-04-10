import React, { FunctionComponent } from "react";
import { Grid, Typography, Link } from "@mui/material";
import { Option as OptionProps } from "../models";

export const Option: FunctionComponent<OptionProps> = ({
  name,
  img,
  uri
}) => {

  return (
    <Grid container>
      <Grid item container xs={12}>
        <Grid item xs={4}>
          <img style={{ width: "100%" }} src={img} alt={name} />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1">
            {name}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Link href={uri} target="_blank">More</Link>
      </Grid>
    </Grid>
  );
}
