import { IconName } from "../components/dynamic-icon";

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
  // TODO: get from backend
    Pending = 0,
    Notified = 1,
    InProgress = 2,
    Decided = 3,
    Error = -1
}

export interface Participant {
  id: string;
  name: string;
  phone?: string;
  email?: string;
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
  id: string;
  participantId: string;
  pollId: string;

  choices: Choice[];
}

export type PendingRanking = Omit<Ranking, "id" | "participantId">;

export interface Poll {
  id: string;
  name: string;
  description: string;
  ownerName: string;
  ownerToken: string;
  ownerPhone: string;
  optionsList: Option<any>[];
  optionsMap: { [id: string]: Option<any> };
  participants: Participant[];
  expires: string;

  // TODO: expiration
  result: {
    ranked?: Choice[];
    done: boolean;
  }

  rankings: Ranking[];
}

export type PendingPoll = Omit<Poll, "id" | "ownerToken" | "optionsMap" | "optionsList" | "result" | "participants"| "rankings"> & {
  optionsList: PendingOption[];
  participants: PendingParticipant[];
};
