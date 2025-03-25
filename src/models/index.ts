export enum OptionType {
  GOOGLE_PLACE = "google-place",
  GOOGLE_SEARCH_RESULT = "google-search-result",
}

export interface Option<T> {
  id: string;
  type?: OptionType;
  name: string;
  description: string;
  uri: string;
  img: string;
  info?: T;
}

export type PendingOption<O = undefined, I = undefined> = Omit<Option<I>, "id"> & {
  original: O;
};

export enum VoteStatus {
    Pending = 'Pending',
    Notified = 'Notified',
    InProgress = 'InProgress',
    Decided = 'Decided',
    Error = 'Error'
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  token?: string;
  status?: VoteStatus;
}

export type PendingParticipant = Omit<Participant, "id">;

export interface Choice {
  optionId: string;
  choiceTypes: {
    explicitWins: number;
    implicitWins: number;
    explicitLosses: number;
    implicitLosses: number;
    negativeTies: number;
    ambivalentTies: number;
    positiveTies: number;
  }
}

export interface Ranking {
  participantEmail: string;
  pollId: string;

  choices: Choice[];
}

export type PendingRanking = Omit<Ranking, "id" | "participantEmail">;

export type Result = {
    winner: Option<unknown>;
    tie: undefined;
    done: boolean;
  } | {
    winner: undefined;
    tie: Option<unknown>[];
    done: boolean
  }

export interface Poll {
  id: string;
  name: string;
  description: string;
  owner: {
    name: string,
    email: string,
    token?: string
  }
  optionsList: Option<unknown>[];
  optionsMap: { [id: string]: Option<any> };
  participants: Participant[];

  result?: Result;

  rankings?: Ranking[];
}

export type PendingPoll = Omit<Poll, "id" | "owner.token" | "optionsMap" | "optionsList" | "result" | "participants"| "rankings"> & {
  optionsList: PendingOption[];
  participants: PendingParticipant[];
};
