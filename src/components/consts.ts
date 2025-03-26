import { Choice } from "../models";

export const ScoreColors: { [key in keyof Choice["choiceTypes"]]: string } = {
  explicitWins: "rgb(0, 255, 0)",
  positiveTies: "rgb(20, 255, 20)",
  implicitWins: "rgb(45, 200, 45)",
  explicitLosses: "rgb(255, 0, 0)",
  negativeTies: "rgb(255, 10, 60)",
  implicitLosses: "rgb(200,0,255)",
  ambivalentTies: "rgb(130, 130, 130)",
};
