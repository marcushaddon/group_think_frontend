import { Button, Grid, TextareaAutosize, Typography } from "@mui/material";
import React, { FunctionComponent, useCallback, useRef, useState } from "react";

export interface Props {
  onComplete: (options: string[]) => void;
}

export const Options: FunctionComponent<Props> = ({ onComplete }) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string | null>(null);
  const submit = useCallback(() => {
    console.log({ value });
    if (!!!value?.length) {
      alert("Must provide at least two options!");
      return;
    }
    const opts = value.split("\n")
      .filter(l => l.length >= 2);
    onComplete(opts);
  }, [onComplete, value]);
  return (
    <Grid container
      style={{
        justifyContent: "center"
      }}
    >
      <Typography variant="h4">Enter Options</Typography>
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
          onChange={(e) => {
            console.log(e.target.value);
            setValue(e.target.value);
          }}
        />
      </Grid>
      
    </Grid>
  );
}
