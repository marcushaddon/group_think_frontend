import { Choice } from "../models"

export const ScoreColors: { [key in keyof Choice["choiceTypes"]]: string } = {
  explicitWins: "green",
  positiveTies: "blue",
  implicitWins: "cyan",
  explicitLosses: "red",
  negativeTies: "purple",
  implicitLosses: "violet",
  ambivalentTies: "grey",
}