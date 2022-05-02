import { CircularProgress, Grid } from "@mui/material";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import groupthink, { Poll } from "../../client/groupthink";
import { Option, PendingRanking, Choice } from "../../models";
import { ManualReview } from "./manual-review";
import { Matchup } from "./matchup";
import { insertionSort, SortStepResult } from "./sort";
import { buildRanking, optionAwardKey } from "./build-ranking";

export enum OptionAward {
  EXPLICIT_WIN = "explicitWins",
  EXPLICIT_LOSS = "explicitLosses",
  IMPLICIT_WIN = "implicitWins",
  IMPLICIT_LOSS = "implicitLosses",
  POSITIVE_TIE = "positiveTies",
  NEGATIVE_TIE = "negativeTies",
  AMBIVALENT_TIE = "ambivalentTies"
}

export interface MatchupResult {
  optionA: OptionAward;
  optionB: OptionAward;
  winnerId?: string;
}

export type ChoiceMap = { [idAwardKey: string]: number };

const matchupKey = (a: Option, b: Option): string => [a.id, b.id].sort().join("_");

export const VoteRoute: FunctionComponent = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [voting, setVoting] = useState(true);
  const [awardMap, setAwardMap] = useState<{ [optionAward: string]: number}>({});
  const [ranking, setRanking] = useState<PendingRanking | null>(null);
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
      return;
    }

    setOptionA(initialRes.value.choiceA);
    setOptionB(initialRes.value.choiceB);
    setProgress(initialRes.value.progress);
  }, []);

  useEffect(() => {
    if (!params.pollId) return;
    fetchPoll(params.pollId);
  }, [params.pollId, fetchPoll]);

  const submitRanking = useCallback(async (ranking: PendingRanking) => {

    const created = await groupthink.createRanking(ranking);
    setRanking(created);
    setVoting(false);
    navigate(`/${poll!.id}`)
  }, [poll, navigate]);

  const onMatchupResult = useCallback(async (res: MatchupResult) => {  
    if (!poll ) {
      alert("no poll!");
      return;
    }

    const optionAAwardKey = optionAwardKey(optionA!.id, res.optionA);
    const optionBAwardKey = optionAwardKey(optionB!.id, res.optionB);

    const updatedAwardMap = {
      ...awardMap,
      [optionAAwardKey]: (awardMap![optionAAwardKey] || 0) + 1,
      [optionBAwardKey]: (awardMap![optionBAwardKey] || 0) + 1,
    }
    // Record sentiment
    setAwardMap(updatedAwardMap);


    const stepResult = sorter!.next(res.winnerId);

    if (stepResult.done) {
      const ranking = buildRanking(stepResult.value, updatedAwardMap, poll);
      submitRanking(ranking);

      return;
    }

    // new matchup and not done, so set next matchup
    setOptionA(stepResult.value.choiceA);
    setOptionB(stepResult.value.choiceB);
    setProgress(stepResult.value.progress);
  }, [sorter, awardMap, poll, submitRanking, optionA, optionB]);

  if (!poll) {
    return <CircularProgress />;
  }

  return (
    <Grid
      container
      style={{
        height: "100vh",
        overflowY: "hidden"
      }}
    >
      <Grid item xs={12}>
        {poll.description}
      </Grid>
      {voting && <Matchup
        options={poll.optionsList}
        optionA={optionA!}
        optionB={optionB!}
        onResult={onMatchupResult}
      />}
    </Grid>
    
  );

}
