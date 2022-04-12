import { Grid, Typography } from "@mui/material";
import React, { FunctionComponent, useCallback } from "react";
import { MatchupResult, OptionAward } from ".";
import { Option } from "../../components/option";
import { Swipe } from "../../components/swipe";
import { Option as OptionModel } from "../../models";

export interface Props {
  prompt: string;
  optionA: OptionModel;
  optionB: OptionModel;
  onResult: (res: MatchupResult) => void;
}

export const Matchup: FunctionComponent<Props> = ({
  optionA,
  optionB,
  onResult,
  prompt
}) => {
  const chooseA = useCallback(() => {
    onResult({
      winnerId: optionA.id,
      optionA: OptionAward.EXPLICIT_WIN,
      optionB: OptionAward.IMPLICIT_LOSS,
    })
  }, [onResult, optionA]);

  const chooseB = useCallback(() => {
    onResult({
      winnerId: optionB.id,
      optionA: OptionAward.IMPLICIT_LOSS,
      optionB: OptionAward.EXPLICIT_WIN,
    })
  }, [onResult, optionB]);

  const rejectA = useCallback(() => {
    onResult({
      winnerId: optionB.id,
      optionA: OptionAward.EXPLICIT_LOSS,
      optionB: OptionAward.IMPLICIT_WIN,
    })
  }, [onResult, optionB]);

  const rejectB = useCallback(() => {
    onResult({
      winnerId: optionA.id,
      optionA: OptionAward.IMPLICIT_WIN,
      optionB: OptionAward.EXPLICIT_LOSS,
    })
  }, [onResult, optionA]);

  const ambivalantTie = useCallback(() => {
    onResult({
      optionA: OptionAward.AMBILVALANT_TIE,
      optionB: OptionAward.AMBILVALANT_TIE,
    })
  }, [onResult]);

  const positiveTie = useCallback(() => {
    onResult({
      optionA: OptionAward.POSITIVE_TIE,
      optionB: OptionAward.POSITIVE_TIE,
    })
  }, [onResult]);

  const negativeTie = useCallback(() => {
    onResult({
      optionA: OptionAward.NEGATIVE_TIE,
      optionB: OptionAward.NEGATIVE_TIE,
    })
  }, [onResult]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4">
          {prompt}
        </Typography>
      </Grid>
      <Swipe
        onLeft={rejectA}
        onRight={chooseA}
        refreshKey={optionA!.id + optionB!.id}
      >
        <Option
          {...optionA}
        />
      </Swipe>
      
      {/* TODO: tie */}
      <Swipe
        onLeft={negativeTie}
        onRight={positiveTie}
        refreshKey={optionA.id + optionB.id}
      >
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
          <Grid item xs={4} onClick={ambivalantTie} style={{ backgroundColor: "grey" }}>
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
      </Swipe>
      <Swipe
        onLeft={rejectB}
        onRight={chooseB}
        refreshKey={optionA!.id + optionB!.id}
      >
        <Option
          {...optionB}
        />
      </Swipe>
    </Grid>
  );
}
