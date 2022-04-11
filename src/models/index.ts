export interface Option {
  name: string;
  description: string;
  uri: string;
  img: string;
}

export enum VoteStatus {
  // TODO: get from backend
    Pending = 0,
    Notified = 1,
    InProgress = 2,
    Decided = 3,
    Error = -1
}

export interface Participant {
  name: string;
  phone?: string;
  email?: string;
  status?: VoteStatus;
}