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
  Icon,
} from "@mui/material";
import { PlacesInfo } from "./places-info";
import { Option as OptionProps, OptionType } from "../../models";

export type Props = Partial<OptionProps<any>>;

// TODO: make generic?
export const Option: FunctionComponent<Props> = ({
  name,
  img,
  uri,
  description,
  info,
  type,
}) => {

  // TODO: typeguard on 'type' field

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
          </Grid>
        </CardContent>
        <CardActions>
          {uri && (
            <Button size="small" href={uri} target="_blank">
              more
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
}

interface InfoProps {
  info: OptionProps<any>["info"];
}

