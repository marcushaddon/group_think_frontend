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
    clearTimeouts();
  }, [refreshKey]);

  const onLeftWrapper = useCallback(() => {
    setRejected(true);
    setLeftTimeout(setTimeout(onLeft, 500)); // TODO: clear prev timeout!!!!
  }, [onLeft]);
  const onRightWrapper = useCallback(() => {
    setSelected(true);
    setRightTimeout(setTimeout(onRight, 200));
  }, [onRight]);

  const drag: React.TouchEventHandler<HTMLDivElement> = useCallback(({ touches }) => {
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

  return (
    <div
      onTouchStart={startDrag}
      onTouchMove={drag}
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
