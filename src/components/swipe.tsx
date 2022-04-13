import { Typography } from "@mui/material";
import React, { useRef, FunctionComponent, useCallback, useState, useEffect } from "react";

export interface Props {
  refreshKey: string;
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

export const Swipe: FunctionComponent<Props> = ({
  children,
  onLeft,
  onRight,
  refreshKey
}) => {
  const [rejected, setRejected] = useState(false);
  const [selected, setSelected] = useState(false);
  const [dragStart, setDragStart] = useState(-1);
  const [leftTimeout, setLeftTimeout] = useState<any>(null);
  const [rightTimeout, setRightTimeout] = useState<any>(null);

  const clearTimeouts = useCallback(() => {
    if (leftTimeout) {
      clearTimeout(leftTimeout);
      setLeftTimeout(null);
    }
    if (rightTimeout) {
      clearTimeout(rightTimeout);
      setRightTimeout(null);
    }
  }, [leftTimeout, rightTimeout]);

  useEffect(() => {
    setRejected(false);
    setSelected(false);
    setDragStart(-1);
    clearTimeouts();
  }, [refreshKey]);

  const onLeftWrapper = useCallback(() => {
    setRejected(true);
    onLeft(); // TODO: clear prev timeout!!!!
  }, [onLeft]);
  const onRightWrapper = useCallback(() => {
    setSelected(true);
    onRight();
  }, [onRight]);

  const drag: React.TouchEventHandler<HTMLDivElement> = useCallback(({ touches }) => {
    if (dragStart < 0) return;

    const delta = touches[0].clientX - dragStart;
    if (delta < -50) {
      return onLeftWrapper();
    }
    if (delta > 50) {
      return onRightWrapper();
    }
  }, [dragStart]);

  const startDrag: React.TouchEventHandler<HTMLDivElement> = useCallback(({ touches }) => {
    setDragStart(touches[0].clientX);
  }, []);

  const cancelDrag: React.TouchEventHandler<HTMLDivElement> = useCallback(() => { setDragStart(-1); }, [])

  return (
    <div
      onTouchStart={startDrag}
      onTouchMove={drag}
      onTouchEnd={cancelDrag}
      style={{
        position: "relative",
        width: "100%",
        height: "100%"
      }}
    >
      {rejected && <Rejected />}
      {selected && <Selected />}
      {children}
    </div>
  );
}
