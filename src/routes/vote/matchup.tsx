import { Grid, Snackbar, Typography } from "@mui/material";
import React, { FunctionComponent, useCallback, useState } from "react";
import { MatchupResult, OptionAward } from ".";
import { Option } from "../../components/option";
import { Swipe } from "../../components/swipe";
import { Option as OptionModel } from "../../models";

export interface Props {
  options: OptionModel[];
  optionA: OptionModel;
  optionB: OptionModel;
  onResult: (res: MatchupResult) => void;
}

export const Matchup: FunctionComponent<Props> = ({
  options,
  optionA,
  optionB,
  onResult,
}) => {
  const [snackMessage, setSnackMessage] = useState<string | null>(null);
  const chooseA = useCallback(() => {
    onResult({
      winnerId: optionA.id,
      optionA: OptionAward.EXPLICIT_WIN,
      optionB: OptionAward.IMPLICIT_LOSS,
    });
    setSnackMessage(`+1 for ${optionA.name}`);
  }, [onResult, optionA]);

  const chooseB = useCallback(() => {
    // debugger;
    onResult({
      winnerId: optionB.id,
      optionA: OptionAward.IMPLICIT_LOSS,
      optionB: OptionAward.EXPLICIT_WIN,
    });
    setSnackMessage(`+1 for ${optionB.name}`);
  }, [onResult, optionB]);

  const rejectA = useCallback(() => {
    // debugger;
    onResult({
      winnerId: optionB.id,
      optionA: OptionAward.EXPLICIT_LOSS,
      optionB: OptionAward.IMPLICIT_WIN,
    });
    setSnackMessage(`-1 for ${optionA.name}`);
  }, [onResult, optionB, optionA]);

  const rejectB = useCallback(() => {
    // debugger;
    onResult({
      winnerId: optionA.id,
      optionA: OptionAward.IMPLICIT_WIN,
      optionB: OptionAward.EXPLICIT_LOSS,
    });
    setSnackMessage(`-1 for ${optionB.name}`);
  }, [onResult, optionA, optionB]);

  const ambivalentTie = useCallback(() => {
    // debugger;
    onResult({
      optionA: OptionAward.AMBIVALENT_TIE,
      optionB: OptionAward.AMBIVALENT_TIE,
    });
    setSnackMessage(`meh to both`);
  }, [onResult]);

  const positiveTie = useCallback(() => {
    // debugger;
    onResult({
      optionA: OptionAward.POSITIVE_TIE,
      optionB: OptionAward.POSITIVE_TIE,
    });
    setSnackMessage("i cant choose!");
  }, [onResult]);

  const negativeTie = useCallback(() => {
    // debugger;
    onResult({
      optionA: OptionAward.NEGATIVE_TIE,
      optionB: OptionAward.NEGATIVE_TIE,
    });
    setSnackMessage("ugh, neither one please");
  }, [onResult]);

  return (
    <Grid container>
      <Grid item xs={12}>
        {/* TOP HALF */}
        <Grid item xs={12}>
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
    style={{
      border: "1px solid grey",
      padding: "16px",
    }}
  >
    <Grid item xs={4} style={{ backgroundColor: "red" }}>
      <Typography variant="subtitle2">
        &lt;&lt;&lt; x (hate both)
      </Typography>
    </Grid>
    <Grid item xs={4} onClick={ambivalentTie} style={{ backgroundColor: "grey" }}>
      <Typography variant="subtitle2">
        ¯\_(ツ)_/¯ (meh)
      </Typography>
    </Grid>
    <Grid item xs={4} style={{ backgroundColor: "green" }}>
      <Typography variant="subtitle2">
        + (love both) &gt;&gt;&gt;
      </Typography>
    </Grid>
  </Grid>
)
