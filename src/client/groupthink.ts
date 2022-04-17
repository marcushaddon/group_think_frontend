import { PendingOption, Option, Participant, PendingRanking, Ranking } from "../models";

export type PendingPoll = Omit<Poll, "id" | "ownerToken" | "optionsMap" | "optionsList"> & {
  optionsList: PendingOption[];
};

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
}

export class GroupthinkClient {
  constructor(private baseUrl: string) {}

  async createPoll(poll: PendingPoll): Promise<Poll> {
    const url = `${this.baseUrl}/polls`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(poll),
    });
    const resBody = await res.json();

    return resBody;
  }

  async getPoll(pollId: string): Promise<Poll | null> {
    const accessToken = localStorage.getItem(`${pollId}token`);
    if (!accessToken) return null;

    const url = `${this.baseUrl}/polls/${pollId}`;

    const res = await fetch(url, {
      headers: { "access-token": accessToken }
    });

    return res.json();
  }

  async createRanking(pending: PendingRanking): Promise<Ranking> {
    const accessToken = localStorage.getItem(`${pending.pollId}token`);
    if (!accessToken) throw new Error("No token found for poll: " + pending.pollId);

    const url = `${this.baseUrl}/rankings`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "access-token": accessToken },
      body: JSON.stringify(pending),
    });

    const resBody = await res.json();

    return resBody as Ranking;
  }
}

const groupthink = new GroupthinkClient("http://localhost:8080");

export default groupthink;
