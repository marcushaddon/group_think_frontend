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

const IconMap = {
  cancel: <Cancel color="error" />,
  check: <CheckCircle color="success" />,
  clock: <AccessTime color="secondary" />,
  remove: <Remove />,
  star: <Star color="warning" />,
  starOutline: <StarOutline color="warning" />,
  money: <AttachMoney color="success" />,
  link: <Link />
}

export type IconName = keyof typeof IconMap;

export interface Props {
  name: IconName;
}
export const DynamicIcon: FunctionComponent<Props> = ({ name }) => IconMap[name];
