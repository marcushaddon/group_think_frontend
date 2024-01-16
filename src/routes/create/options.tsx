import { Button, Grid, TextareaAutosize, Typography } from "@mui/material";
import React, { FunctionComponent, useCallback, useRef, useState } from "react";

export interface Props {
  onComplete: (options: string[]) => void;
}

export const Options: FunctionComponent<Props> = ({ onComplete }) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string | null>(null);
  const submit = useCallback(() => {
    if (!value) {
      alert("Must provide at least two options!");
      return;
    }
    const opts = value.split("\n")
      .filter(l => l.length >= 2);
    console.log({ opts });
    onComplete(opts);
  }, [onComplete]);
  return (
    <Grid container
      style={{
        justifyContent: "center"
      }}
    >
      <Typography variant="h3">Options</Typography>
      <Grid item
        style={{
          width: "90%"
        }}
      >
        <Button
          variant="outlined"
          onClick={submit}
          disabled={!!!value}
        >
          Save
        </Button>
        <TextareaAutosize
          ref={textRef}
          style={{
            width: "90%",
            left: "auto",
            right: "auto",
            resize: "none",
            marginTop: "8px"
          }}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </Grid>
      
    </Grid>
  );
}
