import { Grid } from "@mui/material";
import React, { FunctionComponent } from "react";
import { ChoiceBreakdown } from "../stats";

type RGB = [number, number, number];

const rgbStr = ([r, g, b]: RGB): string => `rgb(${r}, ${g}, ${b})`;

const lerpColor = (from: RGB, to: RGB, steps: number): RGB[] => {
  const delta = from.map((ch, i) => to[i] - ch);
  const inc = delta.map(ch => ch / steps); 

  const stops = [...Array(steps)]
    .map((_, step) => {
      const progress = inc.map(ch => ch * step);
      return from.map((ch, chIdx) => ch + progress[chIdx]);
    });

  return stops as RGB[];
}

export const Breakdown: FunctionComponent<ChoiceBreakdown & { style?: React.CSSProperties}> = ({
  placements,
  style,
}) => {

  const colors = lerpColor([0, 255, 0], [255, 0, 0], placements.length);

  return (
    <Grid
      xs={12}
      style={{
        ...(style || {}),
        padding: "8px",
        width: "100["
      }}
    >
      {/* PLACEMENTS */}
      <Grid
        container
        columns={placements.length}
        style={{
          height: "100%",
        }}
      >
        {placements.map((ratio, place) => (
          <Grid
            item
            xs={1}
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              textAlign: "center"
            }}
          >
            {/* bar */}
            <div
              style={{
                height: `${ratio * 100}%`,
                backgroundColor: rgbStr(colors[place]),
                borderRadius: "6px"
            }}>
              </div>
            #{place + 1}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
