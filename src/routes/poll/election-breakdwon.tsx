import { FunctionComponent } from "react";
import { ElectionEvent as ElectionEventModel, FirstPlaceSharesEvent, LoserChosenEvent, MajorityEvent, RoundEvent, TieEvent } from "../../alg/ranked-choice";
import { Option } from "../../models";

export const ElectionBreakdown: FunctionComponent<{
    events: ElectionEventModel[],
    getOption: (optionId: string ) => Option<any>
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
    getOption: (id: string) => Option<any>
}> = ({
    log,
    idx,
    getOption
}) => (
    <div>
        <strong>{idx}. New round. Remaining options:</strong>
        <ul>
            {log.options.map((oid) => <li>"{getOption(oid).name}"</li>)}
        </ul>
    </div>
);

const FirstPlaceShares: FunctionComponent<{
    log: FirstPlaceSharesEvent,
    idx: number,
    getOption: (optionId: string ) => Option<any>
}> = ({
    log,
    idx,
    getOption
}) => (
    <div>
        <strong>{idx}. First place shares:</strong>
        <ul>
            {Object.entries(log.shares).map(
                ([id, share]) => <li>"{getOption(id).name}": {share}</li>
            )}
        </ul>
    </div>
);

const Majority: FunctionComponent<{
    log: MajorityEvent,
    idx: number,
    getOption: (optionId: string ) => Option<any>,
}> = ({
    log,
    idx,
    getOption
}) => (
    <div>
        <strong>{idx}. Majority acheived! "{getOption(log.winner.id).name}" wins with {log.winner.share} first place votes!</strong>
    </div>
);

const Loser: FunctionComponent<{
    log: LoserChosenEvent,
    idx: number,
    getOption: (optionId: string ) => Option<any>,
}> = ({
    log,
    idx,
    getOption
}) => (
    <div>
        <strong>{idx}. Next option eliminated: "{getOption(log.loser).name}" eliminated.</strong>
    </div>
);

const Tie: FunctionComponent<{
    log: TieEvent,
    idx: number,
    getOption: (optionId: string ) => Option<any>,
}> = ({
    log,
    idx,
    getOption
}) => (
    <div>
        <strong>{idx}. It's a tie between {log.winners.map(
            (oid) => `"${getOption(oid).name}"`
        ).join(', ')}</strong>
    </div>
);

export const ElectionEvent: FunctionComponent<{
    log: ElectionEventModel,
    getOption: (optionId: string ) => Option<any>,
    idx: number
}> = ({
    log,
    idx,
    getOption
}) => {
    const element = log.name === "Round" ?
        <NewRound getOption={getOption} idx={idx} log={log} /> : log.name === "FirstPlaceShares" ?
        <FirstPlaceShares getOption={getOption} idx={idx} log={log} /> : log.name === "Majority" ?
        <Majority getOption={getOption} idx={idx} log={log} /> : log.name === "LoserChosen" ?
        <Loser getOption={getOption} idx={idx} log={log} /> : log.name === "Tie" ?
        <Tie getOption={getOption} idx={idx} log={log} /> : `UNREACHABLE`;

    return element;
}