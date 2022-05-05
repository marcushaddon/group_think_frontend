import {
  PendingRanking,
  Ranking,
  Poll, 
  PendingPoll,
} from "../models";


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
    const accessToken = this.getToken(pollId);
    if (!accessToken) throw new Error("No access token found for poll: " + pollId);

    const url = `${this.baseUrl}/polls/${pollId}`;

    const res = await fetch(url, {
      headers: { "access-token": accessToken }
    });

    return res.json();
  }

  async createRanking(pending: PendingRanking): Promise<Ranking> {
    const accessToken = this.getToken(pending.pollId);
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

  getToken(pollId: string): string | null {
    const fromQuery = new URLSearchParams(window.location.search).get("token");
    if (fromQuery) {
      console.log("setting token for poll", pollId, fromQuery);
      localStorage.setItem(`${pollId}token`, fromQuery);

      return fromQuery;
    }

    const fromLocal = localStorage.getItem(`${pollId}token`);
    if (fromLocal) return fromLocal;

    return null;
  }
}

const groupthink = new GroupthinkClient("http://192.168.0.67:8080");

export default groupthink;
