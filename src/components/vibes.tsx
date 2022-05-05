import React, { FunctionComponent } from  "react";
import { ScoreColors } from "./consts";
import { Scores } from "./scores";

export interface Props {
  scores: Scores;
  style?: React.CSSProperties;
}

export const Vibes: FunctionComponent<Props> = ({ scores, style }) => {

  const gradient = gradStr(scores);

  return (
    <div
      style={{
        ...(style ? style : {}),
        background: gradient
      }}
    >

    </div>
  );
};

export const gradStr = (scores: Scores): string => {
  const scoreNames: (keyof Scores)[] = [
    "explicitLosses",
    "negativeTies",
    "implicitLosses",
    "ambivalentTies",
    "implicitWins",
    "positiveTies",
    "explicitWins"
  ];
  const filteredNames = scoreNames
    .filter(sn => scores[sn]);
  const total = Object.values(scores)
    .reduce((t, v) => t + v);
  const inOrder = filteredNames
    .map(name => scores[name] || 0);// BOOKMARK: need to filter out 0s while maintainting index assoc.
  const stacked: number[] = [];
  for (let i = 0; i < inOrder.length; i++) {
    if (i === 0) {
      stacked.push(0);
    } else {
      stacked.push(stacked[i - 1] + inOrder[i])
    }
  }

  const percents = stacked
    .map(s => s / total);
  
  const paired = filteredNames
    .map((sn , i) => ({
      percent: percents[i],
      color: ScoreColors[sn]
    }));

  const joined = paired
    .map(p => `${p.color} ${(p.percent * 100).toFixed(0)}%`)
    .join(", ");
  
  return `linear-gradient(90deg, ${joined })`
}
