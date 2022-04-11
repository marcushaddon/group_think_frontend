import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import groupthink, { Poll } from "../client/groupthink";

export const PollRoute: FunctionComponent = () => {
  const params = useParams();
  const pollId = params.pollId;

  const [poll, setPoll] = useState<Poll | null>(null);
  useEffect(() => {
    const poll = groupthink.getPoll(pollId!)
      .then(poll => setPoll(poll));
    
  }, [pollId]);

  if (!poll) {
    return <CircularProgress />
  }

  return <>TODO</>;
}
