import React, { FunctionComponent } from  "react";
import { ScoreColors } from "./consts";
import { Scores } from "./scores";

export const vibes = (scores: Scores): string => {
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

export const progress = (prog: number): string => {
  const to = (prog * 100).toFixed(0);
  const buffer = (Math.min(prog * 100 + 1, 100)).toFixed(0);
  return `linear-gradient(90deg, rgb(0, 255, 0) 0%, rgb(0, 255, 0) ${to}%, rgb(255, 255, 255) ${buffer}%)`
}
