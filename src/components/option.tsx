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
  CardMedia,
  Icon
} from "@mui/material";
import { Option as OptionProps, PendingOption as PendingOptionProps } from "../models";
import { DynamicIcon } from "./dynamic-icon";

export const Option: FunctionComponent<PendingOptionProps<any> | OptionProps> = ({
  name,
  img,
  uri,
  description,
  infoItems
}) => {

  return (
    <div style={{ padding: "20px" }}>
      <Card
        component={Paper}
        elevation={3}
      >
        <CardMedia
          component="img"
          image={img}
          height="140"
        />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5" component="div">{name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Grid>
            {infoItems && infoItems.length > 0 && (
              <Grid container item xs={12}>
                {infoItems.map(ii => (
                  <Grid xs={6}>
                    <Typography variant="body2">
                      <DynamicIcon name={ii.icon} /> {ii.text}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
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
