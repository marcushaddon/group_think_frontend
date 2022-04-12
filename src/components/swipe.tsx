import { Typography } from "@mui/material";
import React, { useRef, FunctionComponent, useCallback, useState } from "react";

export interface Props {
  children: React.ReactNode;
  onLeft: () => void;
  onRight: () => void;
}

const Rejected: FunctionComponent = () => (
  <div
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundColor: "red"
    }}
  >
    <Typography variant="h3">X</Typography>
  </div>
);

const Selected: FunctionComponent = () => (
  <div
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundColor: "green"
    }}
  >
    <Typography variant="h3">YES</Typography>
  </div>
)

const makeSwipeHandler = (x: number, onLeft: () => void, onRight: () => void) => {
  return (e: TouchEvent) => {
    e.stopPropagation();
    const touchX = e.touches[0]?.clientX || 0;
    const deltaX = touchX - x;

    if (deltaX < -50) {
      return onLeft();
    }
    if (deltaX > 50) {
      return onRight();
    }
  }
}

export const Swipe: FunctionComponent<Props> = ({
  children,
  onLeft,
  onRight
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rejected, setRejected] = useState(false);
  const [selected, setSelected] = useState(false);

  const onLeftWrapper = useCallback(() => {
    setRejected(true);
    setTimeout(onLeft, 200); // TODO: clear prev timeout!!!!
  }, [onLeft]);
  const onRightWrapper = useCallback(() => {
    setSelected(true);
    setTimeout(onRight, 200);
  }, [onRight]);

  const startSwipe: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    const { clientX: x, clientY: y } = e.touches?.[0];
    const swipeHandler = makeSwipeHandler(x, onLeftWrapper, onRightWrapper);
    if (!ref.current) {
      alert("No current!");
      return;
    }

    ref.current.addEventListener("touchmove", swipeHandler);
    e.stopPropagation();
    // TODO: remove handlers on drag end to reset incomplete swipes
  }, [ref, onLeftWrapper, onRightWrapper]);

  return (
    <div
      ref={ref}
      onTouchStart={startSwipe}
      // onTouchMove={drag}
      style={{
        position: "relative"
      }}
    >
      {rejected && <Rejected />}
      {selected && <Selected />}
      {children}
    </div>
  );
}
