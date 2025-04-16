import { useEffect, useState } from "react";
import groupthink from "../client/groupthink";
import { Poll, Ranking, Result } from "../models";
import { Election, rcv } from "../alg/ranked-choice";

export function usePoll(pollId?: string): Poll | undefined {
  const [poll, setPoll] = useState<Poll | undefined>(undefined);

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

export function usePollAsOwner(pollId?: string): Poll | undefined {
  const [poll, setPoll] = useState<Poll | undefined>(undefined);

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

export function usePollWithRankings(pollId?: string): Poll | undefined {
  const [poll, setPoll] = useState<Poll | undefined>(undefined);

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

export function useRankedChoice(poll?: Poll): Election | undefined {
  const [result, setResult] = useState<Election | undefined>();

  useEffect(() => {
    if (!poll || !poll.rankings) {
      setResult(undefined);
      return;
    }

    const asOptIds = poll.rankings.map((ranking) =>
      ranking.choices.map(({ optionId }) => ({ id: optionId })),
    );
    const ranked = rcv(asOptIds);
    const done = poll.rankings.length === poll.participants.length;

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
