import React, { FunctionComponent, useCallback, useState } from "react";
import { MatchupResult, OptionAward } from ".";
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
  const chooseA = useCallback(() => {
    onResult({
      winnerId: optionA.id,
      optionA: OptionAward.EXPLICIT_WIN,
      optionB: OptionAward.IMPLICIT_LOSS,
    });
    setSnackMessage(`+1 ${optionA.name}`);
  }, [onResult, optionA]);

  const chooseB = useCallback(() => {
    onResult({
      winnerId: optionB.id,
      optionA: OptionAward.IMPLICIT_LOSS,
      optionB: OptionAward.EXPLICIT_WIN,
    });
    setSnackMessage(`+1 ${optionB.name}`);
  }, [onResult, optionB]);

  const rejectA = useCallback(() => {
    onResult({
      winnerId: optionB.id,
      optionA: OptionAward.EXPLICIT_LOSS,
      optionB: OptionAward.IMPLICIT_WIN,
    });
    setSnackMessage(`-1 for ${optionA.name}`);
  }, [onResult, optionB, optionA]);

  const rejectB = useCallback(() => {
    onResult({
      winnerId: optionA.id,
      optionA: OptionAward.IMPLICIT_WIN,
      optionB: OptionAward.EXPLICIT_LOSS,
    });
    setSnackMessage(`-1 for ${optionB.name}`);
  }, [onResult, optionA, optionB]);

  const ambivalentTie = useCallback(() => {
    onResult({
      optionA: OptionAward.AMBIVALENT_TIE,
      optionB: OptionAward.AMBIVALENT_TIE,
    });
    setSnackMessage(`meh to both`);
  }, [onResult]);

  const positiveTie = useCallback(() => {
    onResult({
      optionA: OptionAward.POSITIVE_TIE,
      optionB: OptionAward.POSITIVE_TIE,
    });
    setSnackMessage("+1 for both");
  }, [onResult]);

  const negativeTie = useCallback(() => {
    onResult({
      optionA: OptionAward.NEGATIVE_TIE,
      optionB: OptionAward.NEGATIVE_TIE,
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
