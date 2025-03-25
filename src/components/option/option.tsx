import React, { FunctionComponent } from "react";

import { Option as OptionProps, OptionType } from "../../models";

export type Props = Partial<OptionProps<any>>;

// TODO: make generic?
export const Option: FunctionComponent<Props> = ({
  name,
  img,
  uri,
  description,
  info,
  type,
}) => {

  // TODO: typeguard on 'type' field

  return (
    <div style={{ padding: "20px" }}>
      STYLE ME: {name}
    </div>
  );
}

interface InfoProps {
  info: OptionProps<any>["info"];
}

