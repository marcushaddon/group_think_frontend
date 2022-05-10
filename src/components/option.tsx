import React, { FunctionComponent } from "react";
import {
  Grid,
  Typography,
  Link,
  Button,
  Card,
  Paper,
  CardContent,
  CardActions,
  CardMedia
} from "@mui/material";
import { PendingOption as OptionProps } from "../models";

export const Option: FunctionComponent<OptionProps> = ({
  name,
  img,
  uri,
  description,
}) => {

  return (
    <div style={{ padding: "20px" }}>
      <Card
        component={Paper}
        elevation={3}
        variant="outlined"
      >
        <CardMedia
          component="img"
          image={img}
          height="140"
        />
        <CardContent>
          <Typography variant="h5" component="div">{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" href={uri} target="_blank">
            more
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
