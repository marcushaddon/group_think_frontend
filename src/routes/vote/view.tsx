import {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import groupthink from "../../client/groupthink";
import { MatchupResult, Candidate, PendingRanking, Election } from "../../models";
import { Matchup as MatchupComponent } from "./matchup";
import { sorter as makeSorter, Matchup, RankPrompt } from "./sort";
import { buildRanking, optionAwardKey } from "./build-ranking";
import DisableOverscroll from "../../hooks/overscroll";
import { ConfirmInsert } from "./confirm-insert";

export interface Props {
    election?: Election;
    submitRanking: (ranking: PendingRanking) => void;
}

export type ChoiceMap = { [idAwardKey: string]: number };

export const VoteView: FunctionComponent<Props> = ({
    election,
    submitRanking
}) => {
  const [state, setState] = useState<"voting" | "submitting">("voting");
  const [matchups, setMatchups] = useState<MatchupResult[]>([]);
  const [sorter, setSorter] = useState<Generator<
    Matchup<any> | RankPrompt,
    Candidate<any>[],
    boolean | MatchupResult
  > | null>(null);
  const [sorterOutput, setSorterOutput] = useState<Matchup<any> | RankPrompt | undefined>();

  useEffect(() => {
    if (!election) {
        return;
    }
    const shuffled = [...election.candidateList].sort(() =>
      Math.random() > 0.5 ? -1 : 1,
    );
    const generator = makeSorter()(shuffled);
    setSorter(generator);

    const initialRes = generator.next();
    if (initialRes.done) {
      return;
    }

    setSorterOutput(initialRes.value);
  }, [election]);


  const onConfirmInsert = useCallback(
    (confirm: boolean) => {
        const res = sorter!.next(confirm);
        if (res?.done) {
            const ranking = buildRanking(
                res.value,
                matchups,
                election!
            );
            submitRanking(ranking);
            return;
        }

        setSorterOutput(res.value);
    },
    [sorter]
  )

  const onMatchupResult = useCallback(
    async (res: MatchupResult) => {
      if (!election) {
        alert("no poll!");
        return;
      }

      let stepResult = sorter!.next(res);

      const updatedMatchups = [...matchups, res];

      setMatchups(updatedMatchups);

      // TODO: should this happen before we request next matchup?
      if (stepResult.done) {
        console.log("building ranking", { res: stepResult.value, updatedMatchups, election });
        const ranking = buildRanking(
            stepResult.value,
            updatedMatchups,
            election
        );
        submitRanking(ranking);

        return;
      }

      // new matchup and not done, so set next matchup
      setSorterOutput(stepResult.value);
    },
    [sorter, election, submitRanking, setSorterOutput, sorterOutput],
  );

  if (!election) {
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
          {election.name}
        </div>
        {sorterOutput?.name === "matchup" && (
            <MatchupComponent
                className="h-9/10"
                options={election.candidateList}
                optionA={sorterOutput.inserted.name > sorterOutput.inserting.name ? sorterOutput.inserted : sorterOutput.inserting}
                optionB={sorterOutput.inserted.name > sorterOutput.inserting.name ? sorterOutput.inserting : sorterOutput.inserted}
                onResult={onMatchupResult}
            />
        )}

        {sorterOutput?.name === "confirmInsert" && (
            <ConfirmInsert
                candidate={election.candidateMap[sorterOutput.candidateId]}
                onDecide={onConfirmInsert}
            />
        )}
      </div>
    </>
  );
};
