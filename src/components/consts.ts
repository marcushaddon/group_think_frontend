import { Choice } from "../models"

export const ScoreColors: { [key in keyof Omit<Choice, "optionId">]: string } = {
  explicitWins: "green",
  positiveTies: "blue",
  implicitWins: "cyan",
  explicitLosses: "red",
  negativeTies: "purple",
  implicitLosses: "violet",
  ambivalentTies: "grey",
}