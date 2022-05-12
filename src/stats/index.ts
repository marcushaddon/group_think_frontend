import { Choice, Option, Ranking } from "../models";

class Counter {
  private _counts: { [key: string | number]: number };

  constructor() {
    this._counts = {};
  }

  public inc(key: string | number) {
    if (key in this._counts) {
      this._counts[key]++;
    } else {
      this._counts[key] = 1;
    }
  }

  public count(key: string | number) {
    if (key in this._counts) {
      return this._counts[key];
    }

    return 0;
  }
}

export type ChoiceBreakdown = {
  // a place-wise representation of how an option was placed, in ratios
  placements: number[];
  // std dev of placement of an option (lower indicates more consensus)
  consensus: number;
  // ratio of how many wins were explicit
  winExplicitness: number;
  // ratio of how man losses were explicit
  lossExplicitness: number;
};

export type ChoiceReport = { [optionId: string]: ChoiceBreakdown };

export const choiceBreakdowns = (rankings: Ranking[], result: Choice[]): ChoiceReport => {
  const resultMap = result
    .reduce((map, choice) => ({
      ...map,
      [choice.optionId]: choice
    }), {} as { [ optionId: string]: Choice });

  const options = result
    .map(ch => ch.optionId);

  const placeCounts: { [optionId: string]: Counter } = {};
  for (const opt of options) {
    placeCounts[opt] = new Counter();
  }

  for (const ranking of rankings) {
    // tally place counts for each option
    for (let place = 0; place < ranking.choices.length; place++) {
      const optionId = ranking.choices[place].optionId;
      placeCounts[optionId].inc(place);
      console.log(`incrementing place ${place} for optionId ${optionId}`)
    }
  }

  const report: ChoiceReport = {};

  const places = [...new Array(options.length)]
      .map((_, i) => i);

  // arrange everything
  for (const option of options) {
    debugger;
    const placesForOption = places.
      map(place => placeCounts[option].count(place));
    
    const total = placesForOption.reduce((acc, curr) => acc + curr);
    const normalizedPlaces = placesForOption.map(p => p / total);

    const result = resultMap[option];
    const {
      explicitWins,
      implicitWins,
      explicitLosses,
      implicitLosses,
      positiveTies,
      negativeTies
    } = result.choiceTypes;
    
    report[option] = {
      placements: normalizedPlaces,
      consensus: 0, // TODO: write trig consensus func
      winExplicitness:
        (explicitWins + positiveTies) /
        (explicitWins + positiveTies + implicitWins),
      lossExplicitness:
        (explicitLosses + negativeTies) /
        (explicitLosses + negativeTies + implicitLosses),
    };
  }

  return report;
};
