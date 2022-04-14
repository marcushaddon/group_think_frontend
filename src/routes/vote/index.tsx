import { CircularProgress } from "@mui/material";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupthink, { Poll } from "../../client/groupthink";
import { Option } from "../../models";
import { Matchup } from "./matchup";
import { insertionSort, SortStepResult } from "./sort";

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
  console.log("rendering the route!");
  const params = useParams();

  const [fetched, setFetched] = useState(false);
  const [voting, setVoting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sorter, setSorter] = useState<Generator<SortStepResult, Option[], string | undefined> | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [optionA, setOptionA] = useState<Option | null>(null);
  const [optionB, setOptionB] = useState<Option | null>(null);

  const fetchPoll = useCallback(async (pollId: string) => {
    const p = await groupthink.getPoll(pollId);
    if (!p) {
      alert("POLL NOT FOUND");
      return;
    }

    setPoll(p);
    const generator = insertionSort(p.optionsList);
    setSorter(generator);

    const initialRes = generator.next();
    if (initialRes.done) {
      alert("AREADY SORTED?!");
      return;
    }

    console.log("initial sort step prog:", initialRes.value.progress);

    setOptionA(initialRes.value.choiceA);
    setOptionB(initialRes.value.choiceB);
    setProgress(initialRes.value.progress);
  }, []);

  useEffect(() => {
    if (!params.pollId) return;
    fetchPoll(params.pollId);
  }, [params.pollId, fetchPoll]);

  const onMatchupResult = useCallback((res: MatchupResult) => {
    debugger;
    const stepResult = sorter!.next(res.winnerId);
    if (stepResult.done) {
      console.log("DONE SORTINg", stepResult.value);

      return;
    }

    console.log("progress after user chocie", stepResult.value.progress);

    setOptionA(stepResult.value.choiceA);
    setOptionB(stepResult.value.choiceB);
    setProgress(stepResult.value.progress);
  }, [sorter])

  if (!poll) {
    return <CircularProgress />;
  }

  console.log("doing matchup between", { optionA, optionB });

  return voting ? <Matchup
    options={poll.optionsList}
    prompt={poll.description}
    optionA={optionA!}
    optionB={optionB!}
    onResult={onMatchupResult}
  /> : <></>;

}
