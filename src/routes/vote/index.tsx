import { CircularProgress } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupthink, { Poll } from "../../client/groupthink";
import { Option } from "../../models";
import { Matchup } from "./matchup";

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
  console.log("yo vote?", pollId)

  const [poll, setPoll] = useState<Poll | null>(null);
  const [optionA, setOptionA] = useState<Option | null>(null);
  const [optionB, setOptionB] = useState<Option | null>(null);

  useEffect(() => {
    console.log("fetching!")
    groupthink.getPoll(pollId)
      .then(p => {
        setPoll(p);
        setOptionA(p!.optionsList[0]);
        setOptionB(p!.optionsList[1]);
      });
  
  }, [pollId]);

  if (!poll) {
    return <CircularProgress />;
  }

  return <Matchup
    prompt={poll.description}
    optionA={optionA!}
    optionB={optionB!}
    onResult={(res: MatchupResult) => {
      console.log(res);
      setOptionA(poll!.optionsList[0]);
      setOptionB(poll!.optionsList[1]);
    }}
  />

}
