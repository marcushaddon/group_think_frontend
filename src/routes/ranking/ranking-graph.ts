import { assert } from "../../common/logging";
import { MatchupAward, MatchupResult, Candidate, Ranking } from "../../models";
import { Matchup } from "../vote/sort";

export const buildRankingGraph = (
  ranking: Ranking,
  optMap: Record<string, Candidate<any>>,
): string => {
  const nodes = ranking.choices.map(({ optionId }, idx) =>
    node(optionId, idx, optMap),
  );
  const edges = ranking.matchups.map((matchup) =>
    matchupEdge(matchup, ranking, optMap),
  );

  console.log({
    nodes,
    edges,
    matchups: ranking.matchups.map((m) => ({
      ...m,
      optionA: optMap[m.optionA].name,
      optionB: optMap[m.optionB].name,
      winnerId: m.winnerId && optMap[m.winnerId].name,
    })),
  });

  return `
  digraph G {
    ${nodes.join("\n")}

    ${edges.join("\n")}
  }
  `;
};

const node = (
  optionId: string,
  idx: number,
  opts: Record<string, Candidate<any>>,
) => `"${optionId}" [label="${idx + 1}. ${opts[optionId].name}"]`;

const matchupEdge = (
  m: MatchupResult,
  ranking: Ranking,
  opts: Record<string, Candidate<any>>,
): string => {
  const { optionA, optionB } = m;
  const [aIdx, bIdx] = [optionA, optionB].map((id) =>
    ranking.choices.findIndex((ch) => ch.optionId === id),
  );
  assert(aIdx > -1 && bIdx > -1, "matchup result options not found in ranking");
  assert(aIdx !== bIdx, "self matchup found");
  // arrows flow from winner to loser
  // winners are lower idxed at this point
  // TODO: have named types for orders of list
  const [from, to] = (
    aIdx < bIdx ? [optionA, optionB] : [optionB, optionA]
  ).map((id) => ({
    optionId: id,
    name: opts[id].name,
  }));
  const attrs =
    m.winnerAward === MatchupAward.EXPLICIT_WIN
      ? { label: "chosen over", color: "green" }
      : m.winnerAward === MatchupAward.IMPLICIT_WIN
        ? { label: "chosen via rejection of", color: "red" }
        : m.winnerAward === MatchupAward.AMBIVALENT_TIE
          ? { label: "tied (neutrally) with", color: "grey" }
          : m.winnerAward === MatchupAward.POSITIVE_TIE
            ? { label: "tied (positively) with", color: "blue" }
            : m.winnerAward === MatchupAward.NEGATIVE_TIE
              ? { label: "tied (negatively) with", color: "purple" }
              : { label: "UNREACHABLE", color: "yellow" };

  return `"${from.optionId}" -> "${to.optionId}" [label="${attrs.label}" fontsize=8 color=${attrs.color}]`;
};
