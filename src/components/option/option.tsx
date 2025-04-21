import { FunctionComponent } from "react";

import { Candidate as OptionProps } from "../../models";

export type Props = Partial<OptionProps<any>> & {
    className?: string;
};

// TODO: make generic?
export const Option: FunctionComponent<Props> = ({
  name,
  className = ""
}) => {
  // TODO: typeguard on 'type' field

  return (
    <div
        className={`${className} text-center content-center border-2 border-double text-xl`}
    >
       {name}
    </div>
  );
};

