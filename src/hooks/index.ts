import { useEffect, useState } from "react";
import groupthink from "../client/groupthink";
import { Poll } from "../models";

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
