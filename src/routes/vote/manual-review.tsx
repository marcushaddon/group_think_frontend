import { FunctionComponent } from "react";
import { PendingRanking } from "../../models";

export interface Props {
  ranking: PendingRanking;
}

export const ManualReview: FunctionComponent<Props> = ({ ranking }) => {
  return (
    <ol>
      {ranking.choices.map((ch) => (
        <li key={ch.candidateId}>{ch.candidateId}</li>
      ))}
    </ol>
  );
};
