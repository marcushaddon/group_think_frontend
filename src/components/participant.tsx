import{ FunctionComponent } from "react";
import {
  PendingParticipant,
  Participant as ParticipantModel,
  VoteStatus,
} from "../models";
import { Action } from "./action";

export interface Props {
  participant: ParticipantModel | PendingParticipant;
  action?: Action;
  highlight?: boolean;
}

export const Participant: FunctionComponent<Props> = ({
  participant,
  action,
  highlight,
}) => {
  const text = (
    <>
      {participant.name}{" "}
      {action && <button onClick={action.cb}>{action.name}</button>}
    </>
  );

  const icon =
    participant.status === VoteStatus.Decided ? (
      <>voted</>
    ) : participant.status === VoteStatus.Pending ? (
      <>pending</>
    ) : (
      <span>TODO: handle other statuses</span>
    );

  return (
    <div
      style={{
        border: highlight ? "1px dashed green" : "",
      }}
    >
      <div>
        {icon} {text}
      </div>
    </div>
  );
};
