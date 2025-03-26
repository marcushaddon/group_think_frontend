import React, {
  useRef,
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from "react";

export interface Props {
  visible: boolean;
  refreshKey: string;
  children: React.ReactNode;
  onLeft: () => void;
  onRight: () => void;
}


export const Swipe: FunctionComponent<Props> = ({
  visible,
  children,
  onLeft,
  onRight,
  refreshKey,
}) => {
  const [_rejected, setRejected] = useState(false);
  const [_selected, setSelected] = useState(false);
  const [_dragStart, setDragStart] = useState(-1);
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

  if (!visible) {
    return <></>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {/* {rejected && <Rejected />}
      {selected && <Selected />} */}
      {children}
      <div style={{ width: "100%" }}>
        <button style={{ width: "50%" }} onClick={onLeftWrapper}>
          No
        </button>
        <button style={{ width: "50%" }} onClick={onRightWrapper}>
          Yes
        </button>
      </div>
    </div>
  );
};
