import { useEffect, useState } from "react";
import groupthink from "../client/groupthink";
import { Election, Ranking } from "../models";
import { RCEResult, rcv } from "../alg/ranked-choice";
import { AvgRankingResult, avgRankings } from "../alg/avg-ranking";

export function usePoll(pollId?: string): Election | undefined {
  const [poll, setPoll] = useState<Election | undefined>(undefined);

  useEffect(() => {
    if (!pollId) {
      setPoll(undefined);
      return;
    }
    groupthink.getPoll(pollId).then((poll) => {
      setPoll(poll ?? undefined);
    });
  }, [pollId]);

  return poll;
}

export function usePollAsOwner(pollId?: string): Election | undefined {
  const [poll, setPoll] = useState<Election | undefined>(undefined);

  useEffect(() => {
    if (!pollId) {
      setPoll(undefined);
      return;
    }
    groupthink.getPollAsOwner(pollId).then((poll) => {
      setPoll(poll ?? undefined);
    });
  }, [pollId]);

  return poll;
}

export function usePollWithRankings(pollId?: string): Election | undefined {
  const [poll, setPoll] = useState<Election | undefined>(undefined);

  useEffect(() => {
    if (!pollId) {
      setPoll(undefined);
      return;
    }
    groupthink.getPollWithRankings(pollId).then((poll) => {
      setPoll(poll ?? undefined);
    });
  }, [pollId]);

  return poll;
}

export function useRankedChoice(poll?: Election): RCEResult | undefined {
  const [result, setResult] = useState<RCEResult | undefined>();

  useEffect(() => {
    if (!poll || !poll.rankings) {
      setResult(undefined);
      return;
    }

    const asOptIds = poll.rankings.map((ranking) =>
      ranking.choices.map(({ candidateId: optionId }) => ({ id: optionId })),
    );
    const ranked = rcv(asOptIds);
    const done = poll.rankings.length === poll.voters.length;

    setResult(ranked);
  }, [poll]);

  return result;
}

export function useRanking(pollId: string, email: string) {
  const [ranking, setRanking] = useState<Ranking | undefined>();

  useEffect(() => {
    groupthink
      .fetchRanking(pollId, email)
      .then((ranking) => setRanking(ranking));
  });

  return ranking;
}

export function useAvgRanking(
  election?: Election,
): AvgRankingResult | undefined {
  const [res, setRes] = useState<AvgRankingResult>();

  useEffect(() => {
    if (!election || !election.rankings?.length) {
      setRes(undefined);
      return;
    }

    const newRes = avgRankings(
      election!.candidateList.map(({ id }) => id),
      election.rankings.map((ranking) =>
        ranking.choices.map((ch) => ch.candidateId),
      ),
    );

    setRes(newRes);
  }, [election]);

  return res;
}
