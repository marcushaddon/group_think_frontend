import { PlusOne, Check, Cancel } from "@mui/icons-material";
import { Zoom } from "@mui/material";
import React, { FunctionComponent, useState, useCallback } from "react";

export interface Props {
  visible: boolean;
  refreshKey: string;
  children: React.ReactNode;
  onLeft: () => void;
  onRight: () => void;
}

enum Dir {
  LEFT = "L",
  RIGHT = "R",
  UP = "U",
  DOWN = "D",
}

const THRESHOLD = 20;

const getDist = ([x1, y1]: [number, number], [x2, y2]: [number, number]): number =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

const calcDelta = ([x1, y1]: [number, number], [x2, y2]: [number, number]): [number, number] =>
  [x2 - x1, y2 - y1];

const calcDir = ([x, y]: [number, number]): Dir | undefined => {
  if (x === y) return;

  if (x < -THRESHOLD) {
    return Dir.LEFT;
  } 
  if (x > THRESHOLD) {
    return Dir.RIGHT;
  }
  if (y < -THRESHOLD) {
    return Dir.DOWN;
  }
  if (y > THRESHOLD) {
    return Dir.UP;
  }
}

const ResultStyle: React.CSSProperties = {
  position: "absolute",
    inset: 0,
    color: "white",
    margin: "auto",
    width: "50%",
    height: "50%",
    textAlign: "center"
}

const Confirm = () => (
  <div
    style={{
      ...ResultStyle,
      backgroundColor: "green",
    }}
  >
    <Zoom in={true} style={{ transitionDelay: "100ms" }}>
      <Check sx={{ fontSize: "200px"}} />
    </Zoom>
    
  </div>
);

const Reject = () => (
  <div
    style={{
      ...ResultStyle,
      backgroundColor: "red",
    }}
  >
    <Zoom in={true} style={{ transitionDelay: "100ms" }}>
      <Cancel sx={{ fontSize: "200px"}} />
    </Zoom>
    
  </div>
);

export const Swipe: FunctionComponent<Props> = ({
  visible,
  children,
  onLeft,
  onRight
}) => {
  const [swipeStart, setSwipeStart] = useState<[number, number] | null>(null);
  const [dir, setDir] = useState<Dir | null>(null);
  const [xDelta, setXDelta] = useState(0);
  const [yDelta, setYDelta] = useState(0);
  const [hDelta, setHDelta] = useState(0);
  const [vDelta, setVDelta] = useState(0);
  const [displayConfirm, setDisplayConfirm] = useState(false);
  const [displayReject, setDisplayReject] = useState(false);

  const touchMove: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    if (swipeStart === null) {
      console.log("swipe start null! visible?", visible);
      return;
    }
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

    const [xDelt, yDelt] = calcDelta(swipeStart, coord);
    setXDelta(xDelt);
    setYDelta(yDelt);

    if (dir === Dir.LEFT || dir === Dir.RIGHT) {
      setHDelta(xDelt);
      return;
    } else if (dir === Dir.DOWN || dir === Dir.UP) {
      // setVDelta(yDelt);
      return;
    }

    const maybeDir = calcDir([xDelt, yDelt]);
    if (maybeDir) {
      // setDir(maybeDir);
      // TODO: calc delta from dir/delta in this block
      if (maybeDir === Dir.LEFT || maybeDir === Dir.RIGHT) {
        setDir(maybeDir);
        setHDelta(xDelt);
      } else {
        // setVDelta(yDelt);
      }
    }
  }, [swipeStart, dir, visible]);
  
  const touchStart: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    setSwipeStart([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
  }, []);

  const touchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    setSwipeStart(null);
    setHDelta(0);
    setVDelta(0);
    setXDelta(0);
    setYDelta(0);
    setDir(null);
  }, []);

  if (hDelta > 120 && onRight) {
    touchEnd(null as any);
    setDisplayConfirm(true);
    setTimeout(() => {
      onRight();
      setDisplayConfirm(false);
    }, 600);
  }
  if (hDelta < -120 && onLeft) {
    touchEnd(null as any);
    setDisplayReject(true);
    setTimeout(() => {
      onLeft();
      setDisplayReject(false);
    }, 500);
  }

  const bgColor = xDelta > 0 ? `rgb(${255 - xDelta},255,${255 - xDelta})` :
    `rgb(255,${255 + xDelta},${255 + xDelta})`;

  return visible ? (
    <div
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchMove={touchMove}
      style={{
        position: "relative",
        backgroundColor: displayConfirm ? "green" : displayReject ? "red " : bgColor
      }}
      
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          marginLeft: `${hDelta}px`,
          marginTop: `${vDelta}px`,
          marginRight: `${-hDelta}px`,
          marginBottom: `${-vDelta}px`,
          opacity: displayConfirm || displayReject ? 0 : 1
        }}
      >
        {children}
      </div>
      {displayConfirm && <Confirm />}
      {displayReject && <Reject />}
    </div>
  ) : <></>;
}
