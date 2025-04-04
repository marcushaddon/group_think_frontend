import React, { FunctionComponent, useCallback, useState } from "react";
import { MatchupResult, MatchupAward } from "../../models";
import { Option } from "../../components/option/option";
import { Swipe } from "../../components/swipe";
import { Option as OptionModel } from "../../models";

export interface Props<T> {
  options: OptionModel<T>[];
  optionA: OptionModel<T>;
  optionB: OptionModel<T>;
  onResult: (res: MatchupResult) => void;
  className?: string;
}

export const Matchup = <T extends object>({
  options,
  optionA,
  optionB,
  onResult,
  className = ""
}: Props<T>) => {
  const [_snackMessage, setSnackMessage] = useState<string | null>(null);
  const chooseOption = useCallback((winnerId: string) => {
    onResult({
        optionA: optionA.id,
        optionB: optionB.id,
        winnerAward: MatchupAward.EXPLICIT_WIN,
        winnerId
    })
  }, [optionA, optionB]);
  const rejectOption = useCallback((loserId: string) => {
    onResult({
        optionA: optionA.id,
        optionB: optionB.id,
        winnerAward: MatchupAward.IMPLICIT_WIN,
        winnerId: loserId === optionA.id ? optionB.id : optionA.id
    })
  }, [optionA, optionB, onResult]);

  const chooseA = useCallback(() => {
    chooseOption(optionA.id);
    setSnackMessage(`+1 ${optionA.name}`);
  }, [chooseOption]);

  const chooseB = useCallback(() => {
    chooseOption(optionB.id);
    setSnackMessage(`+1 ${optionB.name}`);
  }, [chooseOption]);

  const rejectA = useCallback(() => {
    rejectOption(optionA.id);
    setSnackMessage(`-1 for ${optionA.name}`);
  }, [rejectOption]);

  const rejectB = useCallback(() => {
    rejectOption(optionB.id);
    setSnackMessage(`-1 for ${optionB.name}`);
  }, [rejectOption]);

  const ambivalentTie = useCallback(() => {
    onResult({
      optionA: optionA.id,
      optionB: optionB.id,
      winnerAward: MatchupAward.AMBIVALENT_TIE,
    });
    setSnackMessage(`meh to both`);
  }, [onResult]);

  const positiveTie = useCallback(() => {
    onResult({
        optionA: optionA.id,
        optionB: optionB.id,
        winnerAward: MatchupAward.POSITIVE_TIE,
    });
    setSnackMessage("+1 for both");
  }, [onResult]);

  const negativeTie = useCallback(() => {
    onResult({
        optionA: optionA.id,
        optionB: optionB.id,
        winnerAward: MatchupAward.NEGATIVE_TIE,
    });
    setSnackMessage("-1 for both");
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
            onLeft={rejectA}
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
          onLeft={negativeTie}
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
            onLeft={rejectB}
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
      &lt;&lt;&lt; x neither
    </div>
    <div
        onClick={ambivalentTie}
        className="flex-1/3 content-center text-center"
    >
      ~ ambivalent
    </div>
    <div
        className="flex-1/3 content-center text-center"
    >
      + both &gt;&gt;&gt;
    </div>
  </div>
);
