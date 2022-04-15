import { CircularProgress } from "@mui/material";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupthink, { Poll } from "../../client/groupthink";
import { Option } from "../../models";
import { ManualReview } from "./manual-review";
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

const matchupKey = (a: Option, b: Option): string => [a.id, b.id].sort().join("_");

export const VoteRoute: FunctionComponent = () => {
  console.log("rendering the route!");
  const params = useParams();

  const [voting, setVoting] = useState(true);
  const [ranking, setRanking] = useState<Option[]>([]);
  const [progress, setProgress] = useState(0);
  const [sorter, setSorter] = useState<Generator<SortStepResult, Option[], string | undefined> | null>(null);
  const [matchupResults, setMatchupResults] = useState<{ [ids: string ]: string | undefined }>({});
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
    let stepResult: IteratorResult<SortStepResult, Option[]>;
    while (true) {
      stepResult = sorter!.next(res.winnerId);
      if (stepResult.done) {
        console.log("TODO: DISPLAY RESULTS!!!", stepResult.value);
        setRanking(stepResult.value);
        setVoting(false);
  
        return;
      }
      const key = matchupKey(stepResult.value.choiceA, stepResult.value.choiceB);
      if (!(key in matchupResults)) {
        // set options, add matchup result, and break
        setMatchupResults({
          ...matchupResults,
          [key]: res.winnerId,
        });
        setOptionA(stepResult.value.choiceA);
        setOptionB(stepResult.value.choiceB);
        setProgress(stepResult.value.progress);
        
        break;
      }
      // feed result to sorter
      stepResult = sorter!.next(matchupResults[key]);
    }
  }, [sorter, matchupResults])

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
  /> : <ManualReview ranking={ranking} />;

}
