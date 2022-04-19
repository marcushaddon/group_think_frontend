import React, { FunctionComponent } from "react";
import { Choice } from "../models";
import { ScoreColors } from "./consts";

export type Scores = Omit<Choice, "optionId">;

export interface Props {
  scores: Scores;
}



export const ScoresComponent: FunctionComponent<Props> = ({
  scores
}) => {
  const total = Object.entries(scores)
    .reduce((t, [ _, val ]) => typeof val === "number" ? t + val : t, 0);
  const ratios: { [key in keyof Scores]: number } = Object.entries(scores)
    .reduce((r, [key, val]) => {
      if (typeof val !== "number") return r;
      return {
        ...r,
        [key]: val / total
      }
    }, {} as { [key in keyof Choice]: number });
  
  
  const scoreNames: (keyof Scores)[] = [
    "explicitLosses",
    "negativeTies",
    "implicitLosses",
    "ambivalentTies",
    "implicitWins",
    "positiveTies",
    "explicitWins"
  ];

  return (
    <div style={{ display: "inline", width: "100%", height: "60px" }}>
      {scoreNames.map(scoreName => (
        <div
          key={scoreName}
          style={{
            height: "10%",
            borderRadius: "6px",
            width: `${ratios[scoreName] * 100}%`,
            backgroundColor: ScoreColors[scoreName]
          }}
        ></div>
      ))}
    </div>
  );
  
}
