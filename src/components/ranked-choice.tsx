import { FunctionComponent } from "react";
import { Choice, Option } from "../models";

export interface Props {
  option: Option<any>;
  choice: Choice;
  winner?: boolean;
  breakdownType?: "visual" | "nl";
}

export const RankedChoice: FunctionComponent<Props> = ({
  option,
}) => {
  return (
    <div>
      <div>
        <img src={option.img} style={{ maxWidth: "100%" }} alt={option.name} />
      </div>
    </div>
  );
};
