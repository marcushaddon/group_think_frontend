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
    return events.map((event) => <ElectionEvent log={event} getOption={getOption} />)

}

const NewRound: FunctionComponent<{
    log: RoundEvent,
    // getOption: (id: string) => Option<any>
}> = ({
    log
}) => (
    <div>
        New round. Remaining options:
        <ul>
            {log.options.map((o) => <li>{o}</li>)}
        </ul>
    </div>
);

const FirstPlaceShares: FunctionComponent<{ log: FirstPlaceSharesEvent }> = ({
    log
}) => (
    <div>
        First place shares:
        <ul>
            {Object.entries(log.shares).map(
                ([id, share]) => <li>{id}: {share}</li>
            )}
        </ul>
    </div>
);

const Majority: FunctionComponent<{ log: MajorityEvent }> = ({
    log
}) => (
    <div>
        Majority acheived! {log.winner.id} wins with {log.winner.share}!
    </div>
);

const Loser: FunctionComponent<{ log: LoserChosenEvent }> = ({
    log
}) => (
    <div>
        Next option eliminated: {log.loser} eliminated.
    </div>
);

const Tie: FunctionComponent<{ log: TieEvent }> = ({
    log
}) => (
    <div>
        TODO: TIE
    </div>
);

export const ElectionEvent: FunctionComponent<{
    log: ElectionEventModel,
    getOption: (optId: { optionId: string }) => Option<any>
}> = ({
    log
}) => {
    const element = log.name === "Round" ?
        <NewRound log={log} /> : log.name === "FirstPlaceShares" ?
        <FirstPlaceShares log={log} /> : log.name === "Majority" ?
        <Majority log={log} /> : log.name === "LoserChosen" ?
        <Loser log={log} /> : log.name === "Tie" ?
        <Tie log={log} /> : `UNREACHABLE`;

    return element;
}