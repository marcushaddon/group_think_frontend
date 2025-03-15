import React, { useCallback, useState } from 'react';
import { PollInfo, Info } from "./poll-info";
import { Participants } from "./participants";
import { PendingOption, PendingParticipant, PendingPoll } from "../../models";
import groupthink from '../../client/groupthink';
import { useNavigate } from 'react-router-dom';
import { Options } from './options';

export enum Step {
  OPTIONS,
  POLL_INFO,
  PARTICIPANTS,
}

const STEPS = [Step.OPTIONS, Step.POLL_INFO, Step.PARTICIPANTS];

export function CreateRoute() {
  const navigate = useNavigate();
  const [step, setStep] = useState(Step.OPTIONS);
  const [options, setOptions] = useState<PendingOption<any, any>[]>([]);
  const [info, setInfo] = useState<Info | null>(null);
  const [participants, setParticipants] = useState<PendingParticipant[]>([]);

  const next = useCallback(async () => {
    const stepIdx = STEPS.indexOf(step);
    if (stepIdx < STEPS.length - 1) {
      setStep(STEPS[stepIdx + 1]);

      return;
    }

    // time to create!
    const poll: PendingPoll = {
      ...info!,
      owner: {
        name: info!.ownerName,
        email: info!.ownerEmail!,
      },
      participants,
      optionsList: options,
    }

    const res = await groupthink.createPoll(poll);

    localStorage.setItem(res.id + "token", res.owner.token!);
    navigate(`/${res.id}/invite`);

  }, [step, info, options, participants, navigate]);

  return (
    <div>
      {step === Step.OPTIONS && <Options onComplete={(opts) => {
        setOptions(opts.map(opt => ({
          name: opt,
          description: "",
          uri: "",
          img: "",
          original: {}
        })));
        next();
      }} />}
      {step === Step.POLL_INFO && <PollInfo onSubmit={pollInfo => { setInfo(pollInfo); next(); } }/>}
      {step === Step.PARTICIPANTS &&
        <Participants
          onComplete={next}
          participants={participants}
          onAddParticipant={p => setParticipants([...participants, p])}
        />}
    </div>
  );
}
