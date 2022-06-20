import React, { FunctionComponent } from "react";
import {
  Cancel,
  CheckCircle,
  Link,
  AttachMoney,
  AccessTime,
  Remove,
  Star,
  StarOutline
} from "@mui/icons-material";
import { PlaceInfo } from "../../client/google-places";

export interface Props {
  info?: PlaceInfo;
}

export const PlacesInfo: FunctionComponent<Props> = ({ info }) => {
  // TODO: render places info!
  return <>GOOGLE PLACES INFO</>;
}