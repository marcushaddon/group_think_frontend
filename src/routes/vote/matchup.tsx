import React, { FunctionComponent, useCallback, useState } from "react";
import { MatchupResult, MatchupAward } from "../../models";
import { Option } from "../../components/option/option";
import { Swipe } from "../../components/swipe";
import { Candidate as OptionModel } from "../../models";

export interface Props {
  options: OptionModel<unknown>[];
  optionA: OptionModel<unknown>;
  optionB: OptionModel<unknown>;
  onResult: (res: MatchupResult) => void;
  className?: string;
}

export const Matchup =({
  options,
  optionA,
  optionB,
  onResult,
  className = ""
}: Props) => {
  const [_snackMessage, setSnackMessage] = useState<string | null>(null);
  const chooseOption = useCallback((winnerId: string) => {
    onResult({
        candidateA: optionA.id,
        candidateB: optionB.id,
        winnerAward: MatchupAward.EXPLICIT_WIN,
        winnerId
    })
  }, [optionA, optionB]);

  const chooseA = useCallback(() => {
    chooseOption(optionA.id);
    setSnackMessage(`+1 ${optionA.name}`);
  }, [chooseOption]);

  const chooseB = useCallback(() => {
    chooseOption(optionB.id);
    setSnackMessage(`+1 ${optionB.name}`);
  }, [chooseOption]);

  const ambivalentTie = useCallback(() => {
    onResult({
      candidateA: optionA.id,
      candidateB: optionB.id,
      winnerAward: MatchupAward.AMBIVALENT_TIE,
    });
    setSnackMessage(`meh to both`);
  }, [onResult]);

  const positiveTie = useCallback(() => {
    onResult({
        candidateA: optionA.id,
        candidateB: optionB.id,
        winnerAward: MatchupAward.POSITIVE_TIE,
    });
    setSnackMessage("+1 for both");
  }, [onResult]);

  return (
    <div
      className={`${className}`}
    >
      {" "}
      {/* BOOKMARK: block this out and debug how to make it fit */}
      {/* TOP HALF */}
      <div
        className="h-4/10 content-center"
      >
        {/* TOP HALF */}
        {options.map((o) => (
          <Swipe
            key={o.id}
            visible={o.id === optionA.id}
            onRight={chooseA}
            refreshKey={optionA!.id + optionB!.id}
            className="h-1/1"
          >
            <Option {...optionA} className="h-1/1" />
          </Swipe>
        ))}
      </div>
      {/* MIDDLE */}
      <div
        className="h-2/10"
      >
        {/* MIDDLE */}
        <Swipe
          onRight={positiveTie}
          visible={true}
          refreshKey={optionA.id + optionB.id}
          className="h-1/1"
        >
          <Tie
            ambivalentTie={ambivalentTie}
            refreshKey={optionA.id + optionB.id}
          />
        </Swipe>
      </div>
      {/* BOTTOM HALF */}
      <div
        className="h-4/10 content-center"
      >
        {/* BOTTOM HALF */}
        {options.map((o) => (
          <Swipe
            key={o.id}
            visible={o.id === optionB.id}
            onRight={chooseB}
            refreshKey={optionA.id + optionB.id}
            className="h-1/1"
          >
            <Option {...optionB} className="h-1/1" />
          </Swipe>
        ))}
      </div>
    </div>
  );
};

interface TieProps {
  ambivalentTie: () => void;
  refreshKey: string;
}
const Tie: FunctionComponent<TieProps> = ({ ambivalentTie }) => (
  <div
    className="h-1/1 flex content-center text-center"
  >
    <div
        className="flex-1/3 content-center text-center"
    >
      + both &gt;&gt;&gt;
    </div>
  </div>
);
