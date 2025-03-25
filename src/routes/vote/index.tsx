import { CircularProgress, Grid } from "@mui/material";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import groupthink from "../../client/groupthink";
import { Option, PendingRanking, Choice, Poll } from "../../models";
import { progress as progGrad } from "../../components/gradients";
import { Matchup as MatchupComponent } from "./matchup";
import { ManualReview } from "./manual-review";
import { sorter as makeSorter, Matchup } from "./sort";
import { buildRanking, optionAwardKey } from "./build-ranking";
import DisableOverscroll from "../../hooks/overscroll";

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
  const [progress, setProgress] = useState(0);
  const [sorter, setSorter] = useState<Generator<Matchup<any>, Option<any>[], MatchupResult> | null>(null);
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

    const shuffled = [...p.optionsList].sort(() => Math.random() > 0.5 ? -1 : 1);
    const generator = makeSorter()(shuffled);
    setSorter(generator);

    const initialRes = generator.next();
    if (initialRes.done) {
      return;
    }

    setOptionA(initialRes.value.inserted);
    setOptionB(initialRes.value.inserting);
  }, []);

  useEffect(() => {
    if (!params.pollId) return;
    fetchPoll(params.pollId);
  }, [params.pollId, fetchPoll]);

  const submitRanking = useCallback(async (ranking: PendingRanking) => {

    const created = await groupthink.createRanking(ranking);
    if (!created) {
        return;
    }

    setVoting(false);
    navigate(`/${poll!.id}?participantEmail=${created.participantEmail}`);
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

    let stepResult = sorter!.next(res);

    if (stepResult.done) {
      const ranking = buildRanking(stepResult.value, updatedAwardMap, poll);
      submitRanking(ranking);

      return;
    }

    

    // new matchup and not done, so set next matchup
    setOptionA(stepResult.value.inserted);
    setOptionB(stepResult.value.inserting);
  }, [sorter, awardMap, poll, submitRanking, optionA, optionB]);

  if (!poll) {
    return <>loading options...</>
  }

  return (
    <>
      <DisableOverscroll />
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
        {voting && <MatchupComponent
            style={{
                height: "80%"
            }}
            options={poll.optionsList}
            optionA={optionA!}
            optionB={optionB!}
            onResult={onMatchupResult}
        />}
      </Grid>
    </>
    
    
  );

}
