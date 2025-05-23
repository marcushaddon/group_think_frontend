import React, { FunctionComponent, useState, useCallback } from "react";

export interface Props {
  visible: boolean;
  refreshKey: string;
  children: React.ReactNode;
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;

  className?: string;
}

enum Dir {
  LEFT = "L",
  RIGHT = "R",
  UP = "U",
  DOWN = "D",
}

const THRESHOLD = 20;

const calcDelta = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
): [number, number] => [x2 - x1, y2 - y1];

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
};

const ResultStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  color: "white",
  margin: "auto",
  width: "50%",
  height: "50%",
  textAlign: "center",
};

const Confirm = () => (
  <div
    style={{
      ...ResultStyle,
      backgroundColor: "green",
    }}
  >
    <div style={{ transitionDelay: "100ms" }}>
      <>TODO: check mark</>
    </div>
  </div>
);

const Reject = () => (
  <div
    style={{
      ...ResultStyle,
      backgroundColor: "red",
    }}
  >
    <div style={{ transitionDelay: "100ms" }}>
      <>TODO: cancel icon</>
    </div>
  </div>
);

export const Swipe: FunctionComponent<Props> = ({
  visible,
  children,
  onLeft,
  onRight,
  onUp, 
  onDown,

  className = ""
}) => {
  const [swipeStart, setSwipeStart] = useState<[number, number] | null>(null);
  const [dir, setDir] = useState<Dir | null>(null);
  const [xDelta, setXDelta] = useState(0);
  const [_yDelta, setYDelta] = useState(0);
  const [hDelta, setHDelta] = useState(0);
  const [vDelta, setVDelta] = useState(0);
  const [displayConfirm, setDisplayConfirm] = useState(false);
  const [displayReject, setDisplayReject] = useState(false);

  const touchMove: React.TouchEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (swipeStart === null) {
        return;
      }
      const coord: [number, number] = [
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY,
      ];

      const [xDelt, yDelt] = calcDelta(swipeStart, coord);
      setXDelta(xDelt);
      setYDelta(yDelt);

      console.log({ dir, onLeft, xDelta })
      if (dir === Dir.LEFT && onLeft ) {
        console.log('swiping left for some reason');
        setHDelta(xDelt);
        return;
      } else if (dir === Dir.RIGHT && onRight) {
        console.log('setting right');
        setHDelta(xDelt);
        return;
      } else if (dir === Dir.DOWN && onDown) {
        setVDelta(yDelt);
        return;
      } else if (dir === Dir.UP && onUp) {
        setVDelta(yDelt);
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
    },
    [swipeStart, dir, visible],
  );

  const touchStart: React.TouchEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      setSwipeStart([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
    },
    [],
  );

  const touchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback(() => {
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

  const bgColor =
    xDelta > 0
      ? `rgb(${255 - xDelta},255,${255 - xDelta})`
      : `rgb(255,${255 + xDelta},${255 + xDelta})`;

  return visible ? (
    <div
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchMove={touchMove}
      className={className}
      style={{
        position: "relative",
        backgroundColor: displayConfirm
          ? "green"
          : displayReject
            ? "red "
            : bgColor,
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
          opacity: displayConfirm || displayReject ? 0 : 1,
        }}
      >
        {children}
      </div>
      {displayConfirm && <Confirm />}
      {displayReject && <Reject />}
    </div>
  ) : (
    <></>
  );
};
