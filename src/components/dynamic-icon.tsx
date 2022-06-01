import React, { FunctionComponent } from "react";
import {
  Cancel,
  CheckCircle,
  AccessTime,
  Remove,
} from "@mui/icons-material";

const IconMap = {
  cancel: <Cancel color="error" />,
  check: <CheckCircle color="success" />,
  clock: <AccessTime color="secondary" />,
  remove: <Remove />
}

export type IconName = keyof typeof IconMap;

export interface Props {
  name: IconName;
}
export const DynamicIcon: FunctionComponent<Props> = ({ name }) => IconMap[name];
