import React, { useState, useCallback, FunctionComponent, useRef, useEffect } from "react";
import { Button, Input, Grid } from "@mui/material";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GOOGLE_API_KEY } from "../../consts";
import { Option as OptionComponent } from "../../components/option";
import { PendingOption } from "../../models";
import { Swipe } from "../../components/swipe";

export interface Props {
  onSelectOption?: (option: PendingOption) => void;
  onComplete?: () => void;
}

export const PlacesSearch: FunctionComponent<Props> = ({
  onSelectOption = console.log,
  onComplete = console.log,
}) => {
  const mapsRef = useRef<HTMLElement | undefined>();
  const [map, setMap] = React.useState<google.maps.Map>();
  const [api, setApi] = useState<google.maps.places.PlacesService | null>(null);
  console.log(api?.findPlaceFromQuery);

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
    
  }, [term]);

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

  useEffect(() => {
    if (mapsRef.current && !map) {
      setMap(new window.google.maps.Map(mapsRef.current, {}));
    }
  }, [mapsRef, map]);

  useEffect(() => {
    if (!map) return;
    const service = new google.maps.places.PlacesService(map);
    setApi(service);
  }, [mapsRef, map]);

  return (
    <Grid container columns={12}>
      <Grid item xs={12}>
        <Wrapper apiKey={GOOGLE_API_KEY}>
          <span>TODO: map loading</span>
        </Wrapper>
      </Grid>
      <Grid item xs={12}>
        <Input
          type="text"
          placeholder="Search to create a poll!"
          onChange={e => updateTerm(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={() => {
          setOffset(0);
          doSearch(0);
        }}>Search</Button>
      </Grid>
      <Grid item xs={12}>
        {results
          .map(result => result.uri in selected ? (
            <div>(TODO: STYLE) {result.name} added to poll</div>
          ) : (
          <Swipe
            onRight={() => {
              setSelected({
                ...selected,
                [result.uri]: true
              });
              selectOption(result);
            }}
            visible={true}
            refreshKey={result.uri}
            onLeft={() => alert("TODO: remove this")}
          >
            <OptionComponent
              {...result}
              key={result.name}
              
            />
          </Swipe>
          
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
