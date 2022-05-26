import React, { useState, useCallback, FunctionComponent, useRef, useEffect } from "react";
import { Button, Input, Grid } from "@mui/material";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GOOGLE_API_KEY } from "../../consts";
import { usePlaces } from "../../client/google-places";
import { Option as OptionComponent } from "../../components/option";
import { PendingOption } from "../../models";
import { Swipe } from "../../components/swipe";
import { GoogleMap } from "./google-map";

export interface Props {
  onSelectOption?: (option: PendingOption) => void;
  onComplete?: () => void;
}

export const PlacesSearch: FunctionComponent<Props> = ({
  onSelectOption = console.log,
  onComplete = console.log,
}) => {
  const places = usePlaces();
  const PAGE_SIZE = 10;
  const [results, setResults] = useState<PendingOption[]>([]);
  const [term, setTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<{ [uri: string]: boolean }>({});

  const updateTerm = useCallback((term: string) => {
    setOffset(0);
    setTerm(term);
  }, [])

  const doSearch = useCallback(async (offset: number = 0) => {
    if (!places) return;

    places.findPlaceFromQuery({
      query: term,
      fields: ["name", "types", "photos", "formatted_address", "business_status", "icon"]
    }, res => console.log(res, "RESULTS"))
  }, [term, places]);

  const pageBack = useCallback(() => {
    setOffset(Math.max(0, offset - PAGE_SIZE));
    doSearch(Math.max(0, offset - PAGE_SIZE));
  }, [offset, doSearch]);

  const pageForward = useCallback(() => {
    setOffset(offset + PAGE_SIZE);
    doSearch(offset + PAGE_SIZE);
  }, [offset, doSearch]);

  const selectOption = useCallback((option: PendingOption) => {
    onSelectOption && onSelectOption(option);
  }, [onSelectOption]);

  return (
    <Grid container columns={12}>
      <Grid item xs={12}>
        <Input type="text" onChange={e => updateTerm(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={!places}
          onClick={() => doSearch()}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}
