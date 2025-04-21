import { useParams } from "react-router-dom";
import { FunctionComponent, useCallback } from "react";
import { Candidate, Ranking } from "../../models";
import { usePoll, useRanking } from "../../hooks";
import { buildRankingGraph } from "./ranking-graph";


export const RankingGraphLink: FunctionComponent<{
    ranking: Ranking, optMap: Record<string, Candidate<any>>
}> = ({
    ranking,
    optMap
}) => {
    const digraph = buildRankingGraph(ranking, optMap);
    return (
        <a
            href={`https://dreampuf.github.io/GraphvizOnline/?engine=dot#${encodeURI(digraph)}`}
            target="_blank"
        >
            <button className="mt-1 py-2.5 px-5 font-medium rounded-lg text-sm border border-gray-200">
                View decisions
            </button> 
        </a>
    );
}

export const RankingRoute: FunctionComponent = () => {
    const params = useParams();


    const { pollId, email } = params;
    if (!pollId || !email) {
        return <>invalid ranking path: {window.location.pathname}</>
    }
    const ranking = useRanking(pollId, email);
    const poll = usePoll(pollId);

    if (!ranking || !poll) {
        return <>fetching ranking...</>;
    }

    return (
        <div>
        </div>
    );
    // return <Ranking ranking={ranking} />;
}
