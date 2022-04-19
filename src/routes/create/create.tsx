import { Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { GoogleSearch } from "./google-search";
import { PollInfo, Info } from "./poll-info";
import { Participants } from "./participants";
import { PendingOption, PendingParticipant } from "../../models";
import groupthink, { PendingPoll } from '../../client/groupthink';
import { useNavigate } from 'react-router-dom';

export enum Step {
  OPTONS,
  POLL_INFO,
  PARTICIPANTS,
}

const STEPS = [Step.OPTONS, Step.POLL_INFO, Step.PARTICIPANTS];

export function CreateRoute() {
  const navigate = useNavigate();
  const [step, setStep] = useState(Step.OPTONS)
  const [options, setOptions] = useState<PendingOption[]>([]);
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
      participants,
      optionsList: options,
    }

    const res = await groupthink.createPoll(poll);

    // TODO: set token
    localStorage.setItem(res.id + "token", res.ownerToken);
    navigate(`/${res.id}`);

  }, [step, info, options, participants, navigate]);

  const onSelectOption = useCallback((opt: PendingOption) => {
    setOptions([...options, opt]);
  }, [options]);

  return (
    <div>
      <Typography variant="h2">
        {options.length + " options selected"}
      </Typography>
      {step === Step.OPTONS && <GoogleSearch onSelectOption={opt => onSelectOption(opt)} onComplete={next} /> }
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
