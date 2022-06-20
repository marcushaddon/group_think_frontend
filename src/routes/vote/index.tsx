import { CircularProgress, Grid } from "@mui/material";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import groupthink from "../../client/groupthink";
import { Option, PendingRanking, Choice, Poll } from "../../models";
import { progress as progGrad } from "../../components/gradients";
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

const matchupKey = (a: Option<any>, b: Option<any>): string => [a.id, b.id].sort().join("_");

const memoMap = new Map<string, string>();

export type ChoiceMap = { [idAwardKey: string]: number };

export const VoteRoute: FunctionComponent = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [voting, setVoting] = useState(true);
  const [awardMap, setAwardMap] = useState<{ [optionAward: string]: number}>({});
  const [ranking, setRanking] = useState<PendingRanking | null>(null);
  const [progress, setProgress] = useState(0);
  const [sorter, setSorter] = useState<Generator<SortStepResult<any>, Option<any>[], string | undefined> | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [optionA, setOptionA] = useState<Option<any> | null>(null);
  const [optionB, setOptionB] = useState<Option<any> | null>(null);

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
    navigate(`/${poll!.id}?participantId=${created.participantId}`);
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

    let stepResult = sorter!.next(res.winnerId);

    while (!stepResult.done) {
      const muKey = matchupKey(stepResult.value.choiceA, stepResult.value.choiceB);
      const redundant = memoMap.has(muKey);
      if (!redundant) {
        break;
      }
      console.log("skipping duplicate matchup!");

      const prevResult = memoMap.get(muKey); // BOOKMARK: might be undefined if previously tie, need to explicitly check if has it, also need to set it

      stepResult = sorter!.next(prevResult);
    }

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
      className="vote.root"
      container
      style={{
        // height: "100vh",
        overflowY: "hidden",
        minHeight: "100vh"
      }}
    >
      <Grid
        item xs={12}
        style={{
          height: "10%",
          background: progGrad(progress)
        }}
      >
        {poll.description}
      </Grid>
      {voting && <Matchup
        style={{
          height: "80%"
        }}
        options={poll.optionsList}
        optionA={optionA!}
        optionB={optionB!}
        onResult={onMatchupResult}
      />}
    </Grid>
    
  );

}
