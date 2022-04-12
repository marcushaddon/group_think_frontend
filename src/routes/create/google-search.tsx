import React, { useState, useCallback, FunctionComponent } from "react";
import { Button, Input, Grid } from "@mui/material";
import googleSearch from "../../client/google";
import { Option as OptionComponent } from "../../components/option";
import { PendingOption } from "../../models";

export interface Props {
  onSelectOption: (option: PendingOption) => void;
  onComplete: () => void;
}

export const GoogleSearch: FunctionComponent<Props> = ({
  onSelectOption,
  onComplete
}) => {
  const PAGE_SIZE = 10;
  const [results, setResults] = useState<PendingOption[]>([]);
  const [term, setTerm] = useState("");
  const [offset, setOffset] = useState(0);

  const updateTerm = useCallback((term: string) => {
    setOffset(0);
    setTerm(term);
  }, [])

  const doSearch = useCallback(async () => {
    const res = await googleSearch.search(term, offset);
    setResults(res.items);
  }, [term, offset]);

  const pageBack = useCallback(() => {
    setOffset(Math.max(0, offset - PAGE_SIZE));
    doSearch();
  }, [offset, doSearch]);

  const pageForward = useCallback(() => {
    setOffset(offset + PAGE_SIZE);
    doSearch();
  }, [offset, doSearch]);

  const selectOption = useCallback((option: PendingOption) => {
    onSelectOption && onSelectOption(option);
  }, [onSelectOption])

  return (
    <Grid container columns={12}>
      <Grid item xs={12}>
        <Input
          type="text"
          placeholder="Search to create a poll!"
          onChange={e => updateTerm(e.target.value)}
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
            onSelect={() => selectOption(result)}
          />
        ))}
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          {offset > 0 && (
            <Button onClick={pageBack}>
              Back
            </Button>
          )}
        </Grid>
        <Grid item xs={6}>
          {results.length > 0 && (
            <Button onClick={pageForward}>
              More...
            </Button>
          )}
        </Grid>
      </Grid>
      <Button onClick={onComplete}>Continue</Button>
    </Grid>
  );
}
