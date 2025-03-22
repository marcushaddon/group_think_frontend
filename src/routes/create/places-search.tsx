import React, { useState, useCallback, FunctionComponent, useRef, useEffect } from "react";
import { Button, Input, Grid, Alert } from "@mui/material";
import { PlaceInfo, usePlaces } from "../../client/google-places";
import { Option as OptionComponent } from "../../components/option/option";
import { OptionType, PendingOption } from "../../models";
import { Swipe } from "../../components/swipe";
import { useLocation } from "./location";

export interface Props {
  onSelectOption?: (option: PendingOption<google.maps.places.PlaceResult, PlaceInfo>) => void;
  onComplete?: () => void;
}

export const PlacesSearch: FunctionComponent<Props> = ({
  onSelectOption,
  onComplete,
}) => {
  const places = usePlaces();
  const PAGE_SIZE = 10;
  const [results, setResults] = useState<PendingOption<google.maps.places.PlaceResult, PlaceInfo>[]>([]);
  const [term, setTerm] = useState("");
  const [location, setLocation] = useLocation();
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<{ [uri: string]: boolean }>({});

  const getLocation = useCallback(() => {

    try {
      navigator
        .geolocation
        .getCurrentPosition(
          location => setLocation(location),
          err => console.log("error resolving location", err),
          { timeout: 10 * 1000 }
        );
    } catch (e) {
      // TODO: display error permanently
      alert("You must enable location services to use this app (currently).");
    }
  }, [setLocation]);

  const updateTerm = useCallback((term: string) => {
    setOffset(0);
    setTerm(term);
  }, [])

  const doSearch = useCallback(async (offset: number = 0) => {
    if (!places || !location) return;

    const res = await places.search({
      location: { lat: location.coords.latitude, lng: location.coords.longitude },
      radius: 50 * 1000, // TODO: give option!
      type: "restaurant", // TODO: give options!
      term,
    });
    setResults(res);
  }, [term, places, location]);

  const pageBack = useCallback(() => {
    setOffset(Math.max(0, offset - PAGE_SIZE));
    doSearch(Math.max(0, offset - PAGE_SIZE));
  }, [offset, doSearch]);

  const pageForward = useCallback(() => {
    setOffset(offset + PAGE_SIZE);
    doSearch(offset + PAGE_SIZE);
  }, [offset, doSearch]);

  const selectOption = useCallback((option: PendingOption<google.maps.places.PlaceResult, PlaceInfo>) => {
    onSelectOption && onSelectOption(option);
  }, [onSelectOption]);

  return (
    <Grid
      container
      columns={12}
      onTouchStart={!location ? getLocation : undefined}
    >
      <Grid item xs={12}>
        <Input type="text" onChange={e => updateTerm(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={!places || !location}
          onClick={() => doSearch()}
        >
          Search
        </Button>
      </Grid>
      <Grid item xs={12}>
        {!location && (
          <Alert variant="outlined" color="warning">
            Resolving location
          </Alert>
        )}
      </Grid>
      <Grid item xs={12}>
        {results.map(result => result.original.place_id! in selected ? (
          <Alert color="info">{result.name} added to poll</Alert>
        ) : (
          <Swipe
            key={result.original.place_id!}
            visible={true}
            refreshKey={result.uri}
            onRight={async () => {
              setSelected({
                ...selected,
                [result.original.place_id!]: true,
              });
              const detailed = await places!.getDetails(result.original);

              selectOption(detailed);
            }}
            onLeft={() => alert("TODO: disable left swiping")}
          >
            <OptionComponent {...result} type={OptionType.GOOGLE_PLACE} />
          </Swipe>
        ))}
      </Grid>
      <Grid item xs={12}>
        <Button onClick={onComplete}>Next</Button>
      </Grid>
    </Grid>
  );
}
