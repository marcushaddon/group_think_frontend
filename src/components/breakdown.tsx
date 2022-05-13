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
  winExplicitness,
  lossExplicitness,
  style,
}) => {

  return (
    <Grid
      item
      xs={12}
      style={{
        ...(style || {}),
        padding: "8px",
      }}
    >
      {/* PLACEMENTS */}
      <Placements placements={placements} />
      <Explicitness wins={winExplicitness} losses={lossExplicitness} />
    </Grid>
  );
};

const Placements: FunctionComponent<{ placements: number[] }> = ({
  placements,
}) => {
  const colors = lerpColor([0, 255, 0], [255, 0, 0], placements.length);

  return (
    <Grid
      container
      columns={placements.length}
      style={{
        height: "80px"
      }}
    >
      {placements.map((ratio, place) => (
        <Grid
          key={place}
          item
          xs={1}
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
            textAlign: "center",
            fontSize: "10px"
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
  );
}

const Explicitness: FunctionComponent<{ wins: number, losses: number }> = ({
  wins, losses
}) => {

  const rightGrad = `linear-gradient(90deg, rgba(127, 127, 0, 0) 0%, rgba(255, 0, 0, ${losses}) 100%)`;
  const leftGrad = `linear-gradient(90deg, rgba(0, 255, 0, ${wins}) 0%, rgba(127, 127, 0, 0) 100%)`;

  return (
    <Grid container style={{ height: "30px" }}>
      <Grid
        item
        xs={6}
        style={{
          height: "100%",
          background: leftGrad,
          opacity: losses
        }}
        ></Grid>
        <Grid
        item
        xs={6}
        style={{
          height: "100%",
          background: rightGrad,
          opacity: wins
        }}
        ></Grid>
    </Grid>
  );
}
