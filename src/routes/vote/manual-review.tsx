import React, { FunctionComponent} from "react";
import { Option } from "../../models";

export interface Props {
  ranking: Option[];
}

export const ManualReview: FunctionComponent<Props> = ({
  ranking
}) => {

  return (
    <>hello take a last look!</>
  );
};
