import { jwtDecode } from "jwt-decode";

import {
  PendingRanking,
  Ranking,
  Poll, 
  PendingPoll,
} from "../models";


export class GroupthinkClient {
  constructor(
    private createPollEndpoint: string = "https://omgwtfbrblolttyl-createpollendpoint.express.val.run/",
    private fsWriteEndpoint = "https://omgwtfbrblolttyl-writefileendpoint.express.val.run/",
    private fsReadEndpoint = "https://omgwtfbrblolttyl-readfileendpoint.express.val.run/",
    private fsReadGlobEndpoint = "https://omgwtfbrblolttyl-readglobendpoint.express.val.run/"
  ) {}

  async readGlob(glob: string, token: string): Promise<string> {
    const res = await fetch(
      this.fsReadGlobEndpoint + "?" + new URLSearchParams({ glob }),
      {
        method: "GET",
        headers: { token }
      }
    );

    return await res.json();
  }

  async writeFile(path: string, file: string, token: string) {
    const res = await fetch(this.fsWriteEndpoint, {
      method: "POST",
      headers: { token },
      body: JSON.stringify({ path, file })
    })
  }

  async readFile(path: string, token: string): Promise<string> {
    const res = await fetch(
      this.fsReadEndpoint + "?" + new URLSearchParams({ path }),
      {
        headers: { token }
      }
    );

    return await res.json();
  }

  async createPoll(poll: PendingPoll): Promise<Poll> {
    const res = await fetch(this.createPollEndpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(poll),
    });
    const resBody = await res.json();

    return resBody;
  }

  async getPoll(pollId: string): Promise<Poll | null> {
    const accessToken = this.getToken(pollId);
    const res = await this.readFile(`/polls/${pollId}`, accessToken);
    const parsed = JSON.parse(res);
    // TODO: read path, read glob for rankings, parse and construct
    return parsed as Poll;;
  }

  async createRanking(pending: PendingRanking): Promise<Ranking> {
    const accessToken = this.getToken(pending.pollId);
    // poll/id/rankings/email.json

    // TODO: construct path, write file 
    return {} as Ranking;
  }

  getToken(pollId: string): string {
    // This won work with our fragment router
    const fromQuery = new URLSearchParams(window.location.search).get("token");
    if (fromQuery) {
      const decoded = jwtDecode(fromQuery);
      console.log("setting token for poll", pollId, { decoded });

      localStorage.setItem(`${pollId}token`, fromQuery);

      return fromQuery;
    }

    const fromLocal = localStorage.getItem(`${pollId}token`);
    const decoded = !fromLocal ? "NULL" : jwtDecode(fromLocal);
    console.log("Token from local", { decoded });
    if (fromLocal) return fromLocal;

    throw new Error("No access token found for poll: " + pollId);
  }
}

const groupthink = new GroupthinkClient();

export default groupthink;
