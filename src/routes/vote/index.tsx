import { CircularProgress } from "@mui/material";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupthink, { Poll } from "../../client/groupthink";
import { Option } from "../../models";
import { Matchup } from "./matchup";
import { insertionSort, StepResult } from "./sort";

export enum OptionAward {
  EXPLICIT_WIN,
  EXPLICIT_LOSS,
  IMPLICIT_WIN,
  IMPLICIT_LOSS,
  POSITIVE_TIE,
  NEGATIVE_TIE,
  AMBILVALANT_TIE
}

export interface MatchupResult {
  optionA: OptionAward;
  optionB: OptionAward;
  winnerId?: string;
}

export const VoteRoute: FunctionComponent = () => {
  const params = useParams();
  const [pollId,] = useState(params.pollId!);

  const [voting, setVoting] = useState(true);
  const [sorter, setSorter] = useState<Generator<StepResult, Option[], string | undefined> | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [optionA, setOptionA] = useState<Option | null>(null);
  const [optionB, setOptionB] = useState<Option | null>(null);

  useEffect(() => {
    groupthink.getPoll(pollId)
      .then(p => {
        if (!p) {
          alert("POLL NOT FOUND");
          return;
        }
        setPoll(p);
        const generator = insertionSort(p.optionsList);
        setSorter(generator);
        const initialChoices = generator.next();
        if (initialChoices.done) {
          alert("AREADY SORTED?!");
          return;
        }
        setOptionA(initialChoices.value.choiceA);
        setOptionB(initialChoices.value.choiceB);
      });
  
  }, [pollId]);

  const onMatchupResult = useCallback((res: MatchupResult) => {
    console.log(res, "TODO: TRACK ENTHUSIASM!!!");
    const stepResult = sorter!.next(res.winnerId);
    if (stepResult.done) {
      console.log("DONE SORTINg", stepResult.value);
      alert("TODO: DISPLAY SORTED");

      return;
    }
    setOptionA(stepResult.value.choiceA);
    setOptionB(stepResult.value.choiceB);
  }, [sorter])

  if (!poll) {
    return <CircularProgress />;
  }

  return voting ? <Matchup
    prompt={poll.description}
    optionA={optionA!}
    optionB={optionB!}
    onResult={onMatchupResult}
  /> : <></>;

}
