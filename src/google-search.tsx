import React, { useState, useCallback } from "react";
import { Button, Input, Grid } from "@mui/material";
import googleSearch from "./client/google";
import { Option as OptionComponent } from "./components/option";
import { Option } from "./models";

export const GoogleSearch = () => {
  const [results, setResults] = useState<Option[]>([]);
  const [term, setTerm] = useState("");

  const doSearch = useCallback(async () => {
    const res = await googleSearch.search(term);
    setResults(res.items);
  }, [term]);

  return (
    <Grid container columns={12}>
      <Grid item xs={12}>
        <Input
          type="text"
          placeholder="Search to create a poll!"
          onChange={e => setTerm(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={doSearch}>Search</Button>
      </Grid>
      <Grid item xs={12}>
        {results.map(result => (
          <OptionComponent
            {...result}
            key={result.name}
          />
        ))}
      </Grid>
    </Grid>
  );
}
