import { FunctionComponent } from "react";
import { Candidate } from "../../models";
import { Option as OptionComponent } from "../../components/option";

export interface Props {
    candidate: Candidate<unknown>,
    onDecide: (confirm: boolean) => void
}

export const ConfirmInsert: FunctionComponent<Props> = ({
    candidate,
    onDecide
}) => {

    return (
        <div className="p-4 max-w-3xl mx-auto text-black space-y-6">
            <div className="text-md text-center font-semibold mb-1">
                Do you want to rank the following candidate?
            </div>
            <OptionComponent {...candidate} />
            <div
                className="flex items-center justify-around"
            >
                <button
                    className="mt-1 py-2.5 px-5 font-medium rounded-lg text-sm bg-red-500"
                    onClick={() => onDecide(false)}
                >
                    No
                </button>
                <button
                    className="mt-1 py-2.5 px-5 font-medium rounded-lg text-sm bg-green-500"
                    onClick={() => onDecide(true)}
                >
                    Yes
                </button>
            </div>
        </div>
    )
}