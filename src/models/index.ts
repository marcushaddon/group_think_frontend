import { RCEResult } from "../alg/ranked-choice";

export enum OptionType {
  GOOGLE_PLACE = "google-place",
  GOOGLE_SEARCH_RESULT = "google-search-result",
}

export interface Candidate<T> {
  id: string;
  type?: OptionType;
  name: string;
  description: string;
  uri: string;
  img: string;
  info?: T;
}

export type PendingCandidate<O = undefined, I = undefined> = Omit<
  Candidate<I>,
  "id"
> & {
  original: O;
};

export enum VoteStatus {
  Pending = "Pending",
  Notified = "Notified",
  InProgress = "InProgress",
  Decided = "Decided",
  Error = "Error",
}

export interface Voter {
  id: string;
  name: string;
  email: string;
  token?: string;
  status?: VoteStatus;
}

export type PendingVoter = Omit<Voter, "id">;

export interface Choice {
  candidateId: string;
}

export enum MatchupAward {
  EXPLICIT_WIN = "explicitWin",
  EXPLICIT_LOSS = "explicitLoss",
  IMPLICIT_WIN = "implicitWin",
  IMPLICIT_LOSS = "implicitLoss",
  POSITIVE_TIE = "positiveTie",
  NEGATIVE_TIE = "negativeTie",
  AMBIVALENT_TIE = "ambivalentTie",
}

export interface MatchupResult {
  candidateA: string;
  candidateB: string;
  winnerId?: string;
  winnerAward: MatchupAward;
}

export interface Ranking {
  voterEmail: string;
  pollId: string;

  choices: Choice[];
  matchups: MatchupResult[];
}

export type PendingRanking = Omit<Ranking, "id" | "voterEmail">;

export interface Election {
  id: string;
  name: string;
  description: string;
  owner: {
    name: string;
    email: string;
    token?: string;
  };
  candidateList: Candidate<unknown>[];
  candidateMap: { [id: string]: Candidate<any> };
  voters: Voter[];

  rcvResult?: RCEResult;

  rankings?: Ranking[];
}

export type PendingElection = Omit<
  Election,
  | "id"
  | "owner.token"
  | "candidateMap"
  | "candidateList"
  | "result"
  | "voters"
  | "rankings"
> & {
  candidateList: PendingCandidate[];
  voters: PendingVoter[];
};
