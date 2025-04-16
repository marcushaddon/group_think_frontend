import { FunctionComponent } from "react";
import { InviteView } from "./view";
import { usePollAsOwner } from "../../hooks";
import { useParams } from "react-router-dom";

export const InviteRoute: FunctionComponent = () => {
    const params = useParams();
    const poll = usePollAsOwner(params.pollId);

    return <InviteView poll={poll} />
}
