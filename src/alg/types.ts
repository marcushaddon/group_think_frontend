export type Majority = {
  winner: string;
  tie: undefined;
};

export type Tie = {
  winner: undefined;
  tie: string[];
};

export type Result = Majority | Tie;
