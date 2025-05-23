import { FunctionComponent } from "react";
import { PollView } from "./view";
import { useParams } from "react-router-dom";
import { usePollWithRankings, useRankedChoice } from "../../hooks";

export const PollRoute: FunctionComponent = () => {
    const params = useParams();
    const pollId = params.pollId;
  
    const poll = usePollWithRankings(pollId);
  
    const done = poll?.rankings?.length === poll?.voters.length;

    return <PollView election={poll && { ...poll  }} />
}
