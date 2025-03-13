import { Button, Grid, TextareaAutosize, Typography } from "@mui/material";
import React, { FunctionComponent, useCallback, useRef, useState } from "react";

export interface Props {
  onComplete: (options: string[]) => void;
}

export const Options: FunctionComponent<Props> = ({ onComplete }) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const submit = useCallback(() => {
    if (options.length < 2) {
      alert("Must provide at least two options!");
      return;
    }

    onComplete(options);
  }, [onComplete, value]);

  return (
    <Grid container
      style={{
        justifyContent: "center"
      }}
    >
      <Typography variant="h4">Enter Options (comma separated)</Typography>
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
            setValue(e.target.value);
            setOptions(
                e.target.value.split(/,\s*/ig).filter((opt) => !!opt.length)
            );
          }}
        />
      </Grid>

      <ol>
      {options.map((opt) => <li>{opt}</li>)}
      </ol>
      
      
    </Grid>
  );
}
