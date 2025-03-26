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
  style?: React.CSSProperties;
}

export const Matchup = <T extends object>({
  options,
  optionA,
  optionB,
  onResult,
  style,
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
      style={{
        ...(style || {}),
      }}
    >
      {" "}
      {/* BOOKMARK: block this out and debug how to make it fit */}
      {/* TOP HALF */}
      <div>
        {/* TOP HALF */}
        {options.map((o) => (
          <Swipe
            key={o.id}
            visible={o.id === optionA.id}
            onLeft={rejectA}
            onRight={chooseA}
            refreshKey={optionA!.id + optionB!.id}
          >
            <Option {...optionA} />
          </Swipe>
        ))}
      </div>
      {/* MIDDLE */}
      <div>
        {/* MIDDLE */}
        <Swipe
          onLeft={negativeTie}
          onRight={positiveTie}
          visible={true}
          refreshKey={optionA.id + optionB.id}
        >
          <Tie
            ambivalentTie={ambivalentTie}
            refreshKey={optionA.id + optionB.id}
          />
        </Swipe>
      </div>
      {/* BOTTOM HALF */}
      <div style={{ height: "40%" }}>
        {/* BOTTOM HALF */}
        {options.map((o) => (
          <Swipe
            key={o.id}
            visible={o.id === optionB.id}
            onLeft={rejectB}
            onRight={chooseB}
            refreshKey={optionA.id + optionB.id}
          >
            <Option {...optionB} />
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
  <div>
    <div style={{ backgroundColor: "red" }}>
      <small>&lt;&lt;&lt; x neither</small>
    </div>
    <div onClick={ambivalentTie} style={{ backgroundColor: "grey" }}>
      <small>~ ambivalent</small>
    </div>
    <div style={{ backgroundColor: "green" }}>
      <small>+ both &gt;&gt;&gt;</small>
    </div>
  </div>
);
