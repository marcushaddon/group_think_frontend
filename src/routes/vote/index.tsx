import {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import groupthink from "../../client/groupthink";
import { Option, PendingRanking, Poll } from "../../models";
import { Matchup as MatchupComponent } from "./matchup";
import { sorter as makeSorter, Matchup } from "./sort";
import { buildRanking, optionAwardKey } from "./build-ranking";
import DisableOverscroll from "../../hooks/overscroll";

export enum OptionAward {
  EXPLICIT_WIN = "explicitWin",
  EXPLICIT_LOSS = "explicitLoss",
  IMPLICIT_WIN = "implicitWin",
  IMPLICIT_LOSS = "implicitLoss",
  POSITIVE_TIE = "positiveTie",
  NEGATIVE_TIE = "negativeTie",
  AMBIVALENT_TIE = "ambivalentTie",
}

export interface MatchupResult {
  optionA: OptionAward;
  optionB: OptionAward;
  winnerId?: string;
}

export type ChoiceMap = { [idAwardKey: string]: number };

export const VoteRoute: FunctionComponent = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<"voting" | "submitting">("voting");
  const [awardMap, setAwardMap] = useState<{ [optionAward: string]: number }>(
    {},
  );
  const [sorter, setSorter] = useState<Generator<
    Matchup<any>,
    Option<any>[],
    MatchupResult
  > | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [optionA, setOptionA] = useState<Option<any> | null>(null);
  const [optionB, setOptionB] = useState<Option<any> | null>(null);

  const fetchPoll = useCallback(async (pollId: string) => {
    const p = await groupthink.getPoll(pollId);
    if (!p) {
      alert("POLL NOT FOUND");
      return;
    }
    setPoll(p);

    const shuffled = [...p.optionsList].sort(() =>
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

      
      navigate(`/${poll!.id}?participantEmail=${created.participantEmail}`);
    },
    [poll, navigate],
  );

  const onMatchupResult = useCallback(
    async (res: MatchupResult) => {
      if (!poll) {
        alert("no poll!");
        return;
      }

      const optionAAwardKey = optionAwardKey(optionA!.id, res.optionA);
      const optionBAwardKey = optionAwardKey(optionB!.id, res.optionB);

      const updatedAwardMap = {
        ...awardMap,
        [optionAAwardKey]: (awardMap![optionAAwardKey] || 0) + 1,
        [optionBAwardKey]: (awardMap![optionBAwardKey] || 0) + 1,
      };
      // Record sentiment
      setAwardMap(updatedAwardMap);

      let stepResult = sorter!.next(res);

      if (stepResult.done) {
        const ranking = buildRanking(stepResult.value, updatedAwardMap, poll);
        submitRanking(ranking);

        return;
      }

      // new matchup and not done, so set next matchup
      setOptionA(stepResult.value.inserted);
      setOptionB(stepResult.value.inserting);
    },
    [sorter, awardMap, poll, submitRanking, optionA, optionB],
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
            options={poll.optionsList}
            optionA={optionA!}
            optionB={optionB!}
            onResult={onMatchupResult}
          />
        )}
      </div>
    </>
  );
};
