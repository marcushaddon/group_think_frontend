import { useEffect, useState } from "react";
import groupthink from "../client/groupthink";
import { Poll, Result } from "../models";
import { rankedChoice } from "../alg/ranked-choice";

export function usePoll(pollId?: string): Poll | undefined {
    const [poll, setPoll] = useState<Poll | undefined>(undefined);

    useEffect(() => {
        if (!pollId) {
            setPoll(undefined);
            return;
        }
        groupthink.getPoll(pollId)
            .then((poll) => {
                setPoll(poll ?? undefined)
            })
    }, [pollId]);

    return poll;
}

export function usePollAsOwner(pollId?:string): Poll | undefined {
    const [poll, setPoll] = useState<Poll | undefined>(undefined);

    useEffect(() => {
        if (!pollId) {
            setPoll(undefined);
            return;
        }
        groupthink.getPollAsOwner(pollId)
            .then((poll) => {
                setPoll(poll ?? undefined)
            })
    }, [pollId]);

    return poll;
}

export function usePollWithRankings(pollId?:string): Poll | undefined {
    const [poll, setPoll] = useState<Poll | undefined>(undefined);

    useEffect(() => {
        if (!pollId) {
            setPoll(undefined);
            return;
        }
        groupthink.getPollWithRankings(pollId)
            .then((poll) => {
                setPoll(poll ?? undefined)
            })
    }, [pollId]);

    return poll;
}

export function useRankedChoice(poll?: Poll): Result | undefined {
    const [result, setResult] = useState<Result | undefined>();

    useEffect(() => {
        if (!poll || !poll.rankings) {
            setResult(undefined);
            return;
        }

        const asOptIds = poll.rankings.map(
            (ranking) => ranking.choices.map(
                ({ optionId }) => ({ id: optionId })
            )
        );
        const ranked = rankedChoice(asOptIds);
        const done = poll.rankings.length === poll.participants.length;

        const result: Result = typeof ranked === 'string' ? {
            winner: poll.optionsMap[ranked],
            tie: undefined,
            done
        } : {
            tie: ranked.map((id) => poll.optionsMap[id]),
            winner: undefined,
            done
        };

        setResult(result);
    }, [poll]);

    return result;
}
