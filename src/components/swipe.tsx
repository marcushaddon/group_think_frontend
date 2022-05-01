import React, { FunctionComponent, useState, useCallback } from "react";

export interface Props {
  visible: boolean;
  refreshKey: string;
  children: React.ReactNode;
  onLeft: () => void;
  onRight: () => void;
}

enum Dir {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

const THRESHOLD = 20;

const getDist = ([x1, y1]: [number, number], [x2, y2]: [number, number]): number =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

const calcDelta = ([x1, y1]: [number, number], [x2, y2]: [number, number]): [number, number] =>
  [x2 - x1, y2 - y1];

const calcDir = ([x, y]: [number, number]): Dir => {
  const horizontal = Math.abs(x) >= Math.abs(y);
  const axis = horizontal ? [Dir.LEFT, Dir.RIGHT] : [Dir.DOWN, Dir.UP];
  const delta = horizontal ? x : y;
  
  return delta < 0 ? axis[0] : axis[1];
}

export const Swipe: FunctionComponent<Props> = ({
  visible,
  children,
  onLeft,
  onRight
}) => {
  const [swipeStart, setSwipeStart] = useState<[number, number] | null>(null);
  const [dir, setDir] = useState<Dir | null>(null);
  const [hDelta, setHDelta] = useState(0);
  const [vDelta, setVDelta] = useState(0);

  const touchMove: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    if (swipeStart === null) {
      console.log("swipe start null!");
      return
    }
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const dist = getDist(coord, swipeStart)
    if (dist < THRESHOLD) {
      return;
    }

    const delta = calcDelta(swipeStart, coord);

    if (dir === null) {
      setDir(calcDir(delta));
      // TODO: calc delta from dir/delta in this block

      return;
    }

    if (dir === Dir.LEFT || dir === Dir.RIGHT) {
      setHDelta(delta[0]);
    } else {
      return; // TEMP
      // set vDelta
      setVDelta(delta[1]);
    }
  }, [swipeStart, dir]);
  
  const touchStart: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    setSwipeStart([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
  }, []);

  const touchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    setSwipeStart(null);
    setHDelta(0);
    setVDelta(0);
  }, []);

  if (hDelta > 100 && onLeft) {
    touchEnd(null as any);
    onRight();
  }
  if (hDelta < -100 && onLeft) {
    touchEnd(null as any);
    onLeft();
  }

  return visible ? (
    <div
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchMove={touchMove}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          marginLeft: `${hDelta}px`,
          marginTop: `${vDelta}px`,
          marginRight: `${-hDelta}px`,
          marginBottom: `${-vDelta}px`
        }}
      >
        {children}
      </div>
    </div>
  ) : <></>;
}
