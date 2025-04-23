import { useEffect, useState } from "react";
import groupthink from "../client/groupthink";
import { Election, Ranking } from "../models";
import { RCEResult, rcv } from "../alg/ranked-choice";
import { AvgRankingResult, avgRankings } from "../alg/avg-ranking";
import { condorcet } from "../alg/condorcet";
import { Result } from "../alg/types";

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

export function useRankedChoice(
  poll?: Election,
): RCEResult | undefined | Error {
  const [result, setResult] = useState<RCEResult | undefined | Error>();

  useEffect(() => {
    if (!poll || !poll.rankings) {
      setResult(undefined);
      return;
    }

    const asOptIds = poll.rankings.map((ranking) =>
      ranking.choices.map(({ candidateId: optionId }) => ({ id: optionId })),
    );

    try {
      const ranked = rcv(asOptIds);
      setResult(ranked);
    } catch (e) {
      setResult(e as Error);
    }
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
): AvgRankingResult | undefined | Error {
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

function useCondorcet(election?: Election): Result | undefined | Error {
  const [res, setRes] = useState<Result | undefined | Error>();

  useEffect(() => {
    if (!election || !election.rankings) {
      setRes(undefined);
      return;
    }

    try {
      const result = condorcet(election.candidateList, election.rankings);
      setRes(result);
    } catch (e) {
      setRes(e as Error);
    }
  }, [election]);

  return res;
}

export function useResult(election?: Election) {
  const rcv = useRankedChoice(election);
  const avg = useAvgRanking(election);
  const condorcetMethod = useCondorcet(election);

  return {
    rcv: {
      value: rcv instanceof Error ? undefined : rcv,
      error: rcv instanceof Error ? rcv : undefined,
    },
    avg: {
      value: avg instanceof Error ? undefined : avg,
      error: avg instanceof Error ? avg : undefined,
    },
    condorcetMethod: {
      value: condorcetMethod instanceof Error ? undefined : condorcetMethod,
      error: condorcetMethod instanceof Error ? condorcetMethod : undefined,
    },
  };
}
