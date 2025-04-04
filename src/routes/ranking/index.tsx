import { FunctionComponent } from "react";
import { Ranking } from "../../models";
import { useRanking } from "../../hooks";
import { useParams } from "react-router-dom";

export const RankingRoute: FunctionComponent = () => {
    const params = useParams();
    const { pollId, email } = params;
    if (!pollId || !email) {
        return <>invalid ranking path: {window.location.pathname}</>
    }
    const ranking = useRanking(pollId, email);

    if (!ranking) {
        return <>fetching ranking...</>;
    }

    return <>got ranking</>;
    // return <Ranking ranking={ranking} />;
}
