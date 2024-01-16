import { Alert, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { GoogleSearch } from "./google-search";
import { PlacesSearch } from "./places-search";
import { PollInfo, Info } from "./poll-info";
import { Participants } from "./participants";
import { SelectSearchType } from "./search-type";
import { PendingOption, PendingParticipant, PendingPoll } from "../../models";
import groupthink from '../../client/groupthink';
import { useNavigate } from 'react-router-dom';
import { Options } from './options';

export enum Step {
  SEARCH_TYPE,
  OPTIONS,
  POLL_INFO,
  PARTICIPANTS,
}

const STEPS = [Step.SEARCH_TYPE, Step.OPTIONS, Step.POLL_INFO, Step.PARTICIPANTS];

export enum SearchType {
  PLACES,
  GOOGLE,
}

export function CreateRoute() {
  const navigate = useNavigate();
  const [step, setStep] = useState(Step.SEARCH_TYPE);
  const [searchType, setSearchType] = useState<SearchType>();
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
      participants,
      optionsList: options,
    }

    const res = await groupthink.createPoll(poll);

    // TODO: set token
    localStorage.setItem(res.id + "token", res.ownerToken);
    navigate(`/${res.id}`);

  }, [step, info, options, participants, navigate]);

  const onSelectOption = useCallback((opt: PendingOption<any, any>) => {
    setOptions([...options, opt]);
  }, [options]);

  const optionStep = searchType === SearchType.GOOGLE ?
    <GoogleSearch onSelectOption={opt => onSelectOption(opt)} onComplete={next} /> :
    searchType === SearchType.PLACES ? <PlacesSearch onSelectOption={opt => onSelectOption(opt)} onComplete={next} /> :
    <Alert color="error">ERROR: unknown searchtype: {searchType}</Alert>;

  return (
    <div>
      <Typography variant="h2">
        {options.length + " options selected"}
      </Typography>
      {step === Step.SEARCH_TYPE && <SelectSearchType onSelectSearchType={st => { setSearchType(st); next(); }} />}
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
