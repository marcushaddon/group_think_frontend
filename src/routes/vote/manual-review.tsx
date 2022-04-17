import React, { FunctionComponent} from "react";
import { PendingRanking } from "../../models";

export interface Props {
  ranking: PendingRanking;
}

export const ManualReview: FunctionComponent<Props> = ({
  ranking
}) => {
  
  return (
    <ol>
      {ranking.choices.map(ch => (
        <li>{ch.optionId}</li>
      ))}
    </ol>
  );
};
