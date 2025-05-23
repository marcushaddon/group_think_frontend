import { jwtDecode } from "jwt-decode";

import {
  PendingRanking,
  Ranking,
  Election,
  PendingElection,
  VoteStatus,
} from "../models";

// TOOD: named parsers
type FileResult = {
  path: string;
  last_touched: string;
  file: string;
};

export class GroupthinkClient {
  constructor(
    private createPollEndpoint: string = "https://omgwtfbrblolttyl-createpollendpoint.web.val.run/",
    private fsWriteEndpoint = "https://omgwtfbrblolttyl-writefileendpoint.web.val.run/",
    private fsReadEndpoint = "https://omgwtfbrblolttyl-readfileendpoint.web.val.run/",
    private fsReadGlobEndpoint = "https://omgwtfbrblolttyl-readglobendpoint.web.val.run/",
  ) {}

  async readGlob(glob: string, token: string): Promise<FileResult[]> {
    const res = await fetch(
      this.fsReadGlobEndpoint + "?" + new URLSearchParams({ glob }),
      {
        method: "GET",
        headers: { token },
      },
    );

    return await res.json();
  }

  async writeFile(path: string, file: string, token: string) {
    const res = await fetch(this.fsWriteEndpoint, {
      method: "POST",
      headers: { token },
      body: JSON.stringify({ path, file }),
    });

    return res.json();
  }

  async readFile(path: string, token: string): Promise<string> {
    const res = await fetch(
      this.fsReadEndpoint + "?" + new URLSearchParams({ path }),
      {
        headers: { token },
      },
    );

    return (await res.json()).file;
  }

  async createPoll(poll: PendingElection): Promise<Election> {
    const res = await fetch(this.createPollEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poll),
    });
    const resBody = await res.json();

    return resBody;
  }

  async getPoll(pollId: string): Promise<Election | null> {
    const accessToken = this.getToken(pollId);
    const res = await this.readFile(`/polls/${pollId}/poll.json`, accessToken);

    const parsed = JSON.parse(res) as Election;

    // TODO: read path, read glob for rankings, parse and construct
    const optionsMap = parsed.candidateList?.reduce(
      (map, current) => ({
        ...map,
        [current.id]: current,
      }),
      {},
    );

    return {
      ...parsed,
      candidateMap: optionsMap,
    } as Election;
  }

  async getPollWithRankings(pollId: string): Promise<Election> {
    const [poll, rankings] = await Promise.all([
      this.getPoll(pollId),
      this.getRankings(pollId),
    ]);

    if (!poll) {
      alert(`Could not find poll ${pollId.slice(0, 5)}`);
      throw new Error("could not find poll");
    }

    if (!rankings) {
      alert(`Could not find rankings for poll ${pollId.slice(0, 5)}`);
      throw new Error("could not find rankings for poll");
    }

    const participansWithStatii = poll.voters.map((p) => ({
      ...p,
      status: rankings.find(
        ({ voterEmail: participantEmail }) => participantEmail === p.email,
      )
        ? VoteStatus.Decided
        : VoteStatus.Pending,
    }));

    return {
      ...poll,
      rankings,
      voters: participansWithStatii,
    };
  }

  async getRankings(pollId: string): Promise<Ranking[]> {
    const token = await this.getToken(pollId);
    const rankingsRes = await this.readGlob(
      `/polls/${pollId}/rankings/*.json`,
      token,
    );

    return rankingsRes.map((fr) => JSON.parse(fr.file));
  }

  async getPollAsOwner(pollId: string): Promise<Election | null> {
    const accessToken = this.getToken(pollId);
    const res = await this.readFile(
      `/polls/${pollId}/owner/poll.json`,
      accessToken,
    );

    const parsed = JSON.parse(res);
    // TODO: read path, read glob for rankings, parse and construct
    return parsed as Election;
  }

  async createRanking(pending: PendingRanking): Promise<Ranking | void> {
    const accessToken = this.getToken(pending.pollId);
    // poll/id/rankings/email.json
    if (!accessToken) {
      alert(`Could not find token for poll ${pending.pollId.slice(0, 5)}`);
      return;
    }

    const parsed = jwtDecode(accessToken);
    const email = (parsed as any)?.meta?.email;
    if (!email) {
      alert("Could not parse email from token");
      return;
    }

    // TODO: construct path, write file
    const path = `/polls/${pending.pollId}/rankings/${email}.json`;
    const created = {
      ...pending,
      voterEmail: email,
    };
    await this.writeFile(path, JSON.stringify(created), accessToken);

    return created;
  }

  async fetchRanking(
    pollId: string,
    email: string,
  ): Promise<Ranking | undefined> {
    const path = `/poll/${pollId}/rankings/${email}.json`;
    const token = this.getToken(pollId);
    // poll/id/rankings/email.json
    if (!token) {
      alert(`Could not find token for poll ${pollId.slice(0, 5)}`);
      return;
    }

    const result = await this.readFile(path, token);

    const parsed: Ranking = JSON.parse(result);
    console.log("feetchRanking: ", parsed);

    return parsed;
  }

  getToken(pollId: string): string {
    const token = this._getToken(pollId);
    console.log("groupthink client: token ", jwtDecode(token));

    return token;
  }

  _getToken(pollId: string): string {
    // This won work with our fragment router
    const fromQuery = new URLSearchParams(window.location.search).get("token");
    if (fromQuery) {
      localStorage.setItem(`${pollId}token`, fromQuery);

      return fromQuery;
    }

    const fromLocal = localStorage.getItem(`${pollId}token`);

    if (fromLocal) return fromLocal;

    throw new Error("No access token found for poll: " + pollId);
  }
}

const groupthink = new GroupthinkClient();

export default groupthink;
