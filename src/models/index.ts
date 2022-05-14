export interface Option {
  id: string;
  name: string;
  description: string;
  uri: string;
  img: string;
}

export type PendingOption = Omit<Option, "id">;

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
  optionsList: Option[];
  optionsMap: { [id: string]: Option };
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
