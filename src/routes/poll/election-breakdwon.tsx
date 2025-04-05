import { FunctionComponent } from "react";
import { ElectionEvent as ElectionEventModel, FirstPlaceSharesEvent, LoserChosenEvent, MajorityEvent, RoundEvent, TieEvent } from "../../alg/ranked-choice";
import { Option } from "../../models";

export const ElectionBreakdown: FunctionComponent<{
    events: ElectionEventModel[],
    getOption: (optId: { optionId: string }) => Option<any>
}> = ({
    events,
    getOption
}) => {
    console.log('election breakdown: events', events);
    return events.map((event, n) => <ElectionEvent idx={n + 1} log={event} getOption={getOption} />)

}

const NewRound: FunctionComponent<{
    log: RoundEvent,
    idx: number,
    // getOption: (id: string) => Option<any>
}> = ({
    log,
    idx
}) => (
    <div>
        <strong>{idx}. New round. Remaining options:</strong>
        <ul>
            {log.options.map((o) => <li>{o}</li>)}
        </ul>
    </div>
);

const FirstPlaceShares: FunctionComponent<{ log: FirstPlaceSharesEvent, idx: number }> = ({
    log,
    idx
}) => (
    <div>
        <strong>{idx}. First place shares:</strong>
        <ul>
            {Object.entries(log.shares).map(
                ([id, share]) => <li>{id}: {share}</li>
            )}
        </ul>
    </div>
);

const Majority: FunctionComponent<{ log: MajorityEvent, idx: number }> = ({
    log,
    idx
}) => (
    <div>
        <strong>{idx}. Majority acheived! {log.winner.id} wins with {log.winner.share}!</strong>
    </div>
);

const Loser: FunctionComponent<{ log: LoserChosenEvent, idx: number }> = ({
    log,
    idx
}) => (
    <div>
        <strong>{idx}. Next option eliminated: {log.loser} eliminated.</strong>
    </div>
);

const Tie: FunctionComponent<{ log: TieEvent, idx: number }> = ({
    log,
    idx
}) => (
    <div>
        <strong>{idx}. TODO: TIE</strong>
    </div>
);

export const ElectionEvent: FunctionComponent<{
    log: ElectionEventModel,
    getOption: (optId: { optionId: string }) => Option<any>,
    idx: number
}> = ({
    log,
    idx
}) => {
    const element = log.name === "Round" ?
        <NewRound idx={idx} log={log} /> : log.name === "FirstPlaceShares" ?
        <FirstPlaceShares idx={idx} log={log} /> : log.name === "Majority" ?
        <Majority  idx={idx} log={log} /> : log.name === "LoserChosen" ?
        <Loser idx={idx} log={log} /> : log.name === "Tie" ?
        <Tie idx={idx} log={log} /> : `UNREACHABLE`;

    return element;
}