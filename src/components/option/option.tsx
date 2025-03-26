import { FunctionComponent } from "react";

import { Option as OptionProps } from "../../models";

export type Props = Partial<OptionProps<any>>;

// TODO: make generic?
export const Option: FunctionComponent<Props> = ({
  name,
}) => {
  // TODO: typeguard on 'type' field

  return <div style={{ padding: "20px" }}>STYLE ME: {name}</div>;
};

