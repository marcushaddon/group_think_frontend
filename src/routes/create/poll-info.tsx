import React, { FunctionComponent, useCallback, useState } from "react";

export interface Info {
  name: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
}

export interface Props {
  onSubmit: (pi: Info) => void;
}

export const PollInfo: FunctionComponent<Props> = ({
  onSubmit
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const submit = useCallback((event: any) => {
    (event as any).preventDefault();
    onSubmit({
      name,
      description,
      ownerName,
      ownerEmail,
    });
    setName("");
    setDescription("");
    setOwnerEmail("");
  }, [onSubmit, name, ownerEmail, description, ownerName]);

  return (
    <form onSubmit={submit}>
      <h3>
        Poll Info
      </h3>
      <div>
        <div>
          <input type="text" required name="name" value={name} placeholder="What is being decided?" onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <input type="text" name="description" value={description} placeholder="Additional details" onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <input type="text" required name="ownerName" value={ownerName} placeholder="Your name" onChange={e => setOwnerName(e.target.value)} />
        </div>
        <div>
          <input type="email" required name="ownerEmail" value={ownerEmail} placeholder="Your email" onChange={e => setOwnerEmail(e.target.value)} />
        </div>
        <button type="submit">
          Continue
        </button>
      </div>
    </form>
  );
}
