import React, { FunctionComponent } from "react";
import { Choice } from "../models";

export type Scores = Omit<Choice, "optionId">;

export interface Props {
  scores: Scores;
}



export const ScoresComponent: FunctionComponent<Props> = ({
  scores
}) => {
  const total = Object.entries(scores)
    .reduce((t, [ _, val ]) => t + typeof val === "number" ? t + val : t, 0);
  const ratios: { [key in keyof Scores]: number } = Object.entries(scores)
    .reduce((r, [key, val]) => {
      if (typeof val !== "number") return r;
      return {
        ...r,
        [key]: val / total
      }
    }, {} as { [key in keyof Choice]: number });
    console.log({ ratios, total }); // BOOKMARK: handle zeros, plus figure out why we have zeros

  const colors: { [key in keyof Scores]: string } = {
    explicitWins: "rgb(0, 255, 0)",
    positiveTies: "rgb(10, 255, 10)",
    implicitWins: "rgb(20, 230, 20)",
    explicitLosses: "rgb(255, 0, 0)",
    negativeTies: "rgb(255, 10, 10)",
    implicitLosses: "grb(230, 20, 20)",
    ambivalentTies: "grey",
  }
  
  const scoreNames: (keyof Scores)[] = [
    "explicitLosses",
    "negativeTies",
    "implicitLosses",
    "ambivalentTies",
    "implicitWins",
    "positiveTies",
    "explicitWins"
  ];

  return (<>TODO: Display scores</>);

  return (
    <div style={{ display: "inline", width: "100%", height: "60px" }}>
      {scoreNames.map(scoreName => (
        <div key={scoreName} style={{ height: "100%", width: `${ratios[scoreName]}%`, backgroundColor: colors[scoreName] }} >{scoreName}</div>
      ))}
    </div>
  );
  
}
