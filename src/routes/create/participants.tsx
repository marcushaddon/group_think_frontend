import React, { FunctionComponent, useCallback, useState } from "react";
import { Participant } from "../../components/participant";
import {
  PendingParticipant as ParticipantModel,
  VoteStatus,
} from "../../models";

export interface Props {
  participants: ParticipantModel[];
  onAddParticipant: (p: ParticipantModel) => void;
  onComplete: () => void;
}

export const Participants: FunctionComponent<Props> = ({
  onComplete,
  onAddParticipant,
  participants,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      (e as any).preventDefault();
      // TODO: Store participants in this component to break parent/child loop
      const existing = participants.find(
        ({ email: existingEmail, name: existingName }) => existingEmail === email);
      if (existing) {
        alert(`${email} already in use by ${existing.name}`);
        return;
      }
      onAddParticipant({
        name,
        email,
        status: VoteStatus.Pending,
      });
      setName("");
      setEmail("");
    },
    [name, email, onAddParticipant],
  );

  return (
    <form onSubmit={submit}>
      <div>
        <div>
          <h3>Add participants</h3>
        </div>
        <div>
          <input
            type="text"
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
        <div>
          <h3>{participants.length} participants</h3>
          {participants.map((p) => (
            <Participant key={p.name + p.email} participant={p} />
          ))}
        </div>
        <button onClick={onComplete}>Next</button>
      </div>
    </form>
  );
};
