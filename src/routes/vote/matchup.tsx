import { Grid, Snackbar, Typography } from "@mui/material";
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
  const [snackMessage, setSnackMessage] = useState<string | null>(null);
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
    <Grid
      container
      style={{
        ...(style || {})
      }}
    > {/* BOOKMARK: block this out and debug how to make it fit */}
      {/* TOP HALF */}
      <Grid item xs={12}>
        {/* TOP HALF */}
        {options.map(o => (
          <Swipe
            key={o.id}
            visible={o.id === optionA.id}
            onLeft={rejectA}
            onRight={chooseA}
            refreshKey={optionA!.id + optionB!.id}
          >
            <Option
              {...optionA}
            />
          </Swipe>
        ))}
      </Grid>
      {/* MIDDLE */}
      <Grid item xs={12}>
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
      </Grid>
      {/* BOTTOM HALF */}
      <Grid item xs={12} style={{ height: "40%" }}>
        {/* BOTTOM HALF */}
        {options.map(o => (
            <Swipe
              key={o.id}
              visible={o.id === optionB.id}
              onLeft={rejectB}
              onRight={chooseB}
              refreshKey={optionA.id + optionB.id}
            >
              <Option
                {...optionB}
              />
            </Swipe>
        ))}
      </Grid>

      <Snackbar
        open={typeof snackMessage === "string"}
        autoHideDuration={2000}
        onClose={() => setSnackMessage(null)}
        message={snackMessage}
      />
    </Grid>
  );
}

interface TieProps {
  ambivalentTie: () => void;
  refreshKey: string;
}
const Tie: FunctionComponent<TieProps> = ({
  ambivalentTie,
  refreshKey
}) => (
  <Grid
    container
    item
    xs={12}
  >
    <Grid item xs={4} style={{ backgroundColor: "red" }}>
      <Typography variant="subtitle2">
        &lt;&lt;&lt; x neither
      </Typography>
    </Grid>
    <Grid item xs={4} onClick={ambivalentTie} style={{ backgroundColor: "grey" }}>
      <Typography variant="subtitle2">
        ~ ambivalent
      </Typography>
    </Grid>
    <Grid item xs={4} style={{ backgroundColor: "green" }}>
      <Typography variant="subtitle2">
        + both &gt;&gt;&gt;
      </Typography>
    </Grid>
  </Grid>
)
