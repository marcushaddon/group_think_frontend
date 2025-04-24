import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Election, PendingRanking } from "../../models";
import groupthink from "../../client/groupthink";
import { VoteView } from "./view";

export const VoteRoute: FunctionComponent = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<"fetching" | "voting" | "submitting">("fetching");

  const [election, setElection] = useState<Election | undefined | null>();

  const submitRanking = useCallback(
      async (ranking: PendingRanking) => {
        setState("submitting");
        const created = await groupthink.createRanking(ranking);
        if (!created) {
          return;
        }
  
        
      //   navigate(`/${poll!.id}/ranking/${created.participantEmail}`);
      navigate(`/${election!.id}`);
  
      },
      [election, navigate],
    );

  const fetchPoll = useCallback(async (pollId: string) => {
    const p = await groupthink.getPoll(pollId);
    if (!p) {
      alert("POLL NOT FOUND");
      return;
    }
    setElection(p);
    setState("voting");

  }, []);
  
  useEffect(() => {
    if (!params.pollId) return;
    fetchPoll(params.pollId);
  }, [params.pollId, fetchPoll]);

  return state === "submitting" ? (
    <div className="mx-auto max-w-3xl text-black">
      Submitting ballot...
    </div>
  ) : election && state === "voting" ? (
    <VoteView election={election} submitRanking={submitRanking} />
  ) : (
    <div className="mx-auto max-w-3xl text-black">
      Fetching candidates...
    </div>
  )

}