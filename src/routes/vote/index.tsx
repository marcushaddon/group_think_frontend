import {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import groupthink from "../../client/groupthink";
import { MatchupResult, Candidate, PendingRanking, Election } from "../../models";
import { Matchup as MatchupComponent } from "./matchup";
import { sorter as makeSorter, Matchup } from "./sort";
import { buildRanking, optionAwardKey } from "./build-ranking";
import DisableOverscroll from "../../hooks/overscroll";


export type ChoiceMap = { [idAwardKey: string]: number };

export const VoteRoute: FunctionComponent = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<"voting" | "submitting">("voting");
  const [matchups, setMatchups] = useState<MatchupResult[]>([]);
  const [sorter, setSorter] = useState<Generator<
    Matchup<any>,
    Candidate<any>[],
    MatchupResult
  > | null>(null);
  const [poll, setPoll] = useState<Election | null>(null);
  const [optionA, setOptionA] = useState<Candidate<any> | null>(null);
  const [optionB, setOptionB] = useState<Candidate<any> | null>(null);

  const fetchPoll = useCallback(async (pollId: string) => {
    const p = await groupthink.getPoll(pollId);
    if (!p) {
      alert("POLL NOT FOUND");
      return;
    }
    setPoll(p);

    const shuffled = [...p.candidateList].sort(() =>
      Math.random() > 0.5 ? -1 : 1,
    );
    const generator = makeSorter()(shuffled);
    setSorter(generator);

    const initialRes = generator.next();
    if (initialRes.done) {
      return;
    }

    setOptionA(initialRes.value.inserted);
    setOptionB(initialRes.value.inserting);
  }, []);

  useEffect(() => {
    if (!params.pollId) return;
    fetchPoll(params.pollId);
  }, [params.pollId, fetchPoll]);

  const submitRanking = useCallback(
    async (ranking: PendingRanking) => {
      setState("submitting");
      const created = await groupthink.createRanking(ranking);
      if (!created) {
        return;
      }

      
    //   navigate(`/${poll!.id}/ranking/${created.participantEmail}`);
    navigate(`/${poll!.id}`);

    },
    [poll, navigate],
  );

  const onMatchupResult = useCallback(
    async (res: MatchupResult) => {
      if (!poll) {
        alert("no poll!");
        return;
      }

      let stepResult = sorter!.next(res);

      const updatedMatchups = [...matchups, res];

      setMatchups(updatedMatchups);

      // TODO: should this happen before we request next matchup?
      if (stepResult.done) {
        const ranking = buildRanking(
            stepResult.value,
            updatedMatchups,
            poll
        );
        submitRanking(ranking);

        return;
      }

      // new matchup and not done, so set next matchup
      setOptionA(stepResult.value.inserted);
      setOptionB(stepResult.value.inserting);
    },
    [sorter, poll, submitRanking, optionA, optionB],
  );

  if (!poll) {
    return <>loading options...</>;
  }

  if (state === "submitting") {
    return <>submitting ranking!</>;
  }

  return (
    <>
      <DisableOverscroll />
      <div
        className="flex-col h-screen"
      >
        <div
            className="h-1/10 text-center content-center"
        >
          {poll.name}
        </div>
        {(
          <MatchupComponent
            className="h-9/10"
            options={poll.candidateList}
            optionA={optionA!}
            optionB={optionB!}
            onResult={onMatchupResult}
          />
        )}
      </div>
    </>
  );
};
