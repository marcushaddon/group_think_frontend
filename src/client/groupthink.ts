import { PendingOption, Option, Participant } from "../models";

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
    console.log({ url });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(poll),
    });
    const resBody = await res.json();
    console.log(resBody);

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
}

const groupthink = new GroupthinkClient("http://localhost:8080");

export default groupthink;
