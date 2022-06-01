import { useEffect, useState } from "react";
import { GOOGLE_API_KEY } from "../consts";
import { Option, PendingOption, InfoItem } from "../models";

export const usePlaces = () => {
  const [api, setApi] = useState<PlacesApi>();

  useEffect(() => {
    if (api) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initMap`;
    (window as any).initMap = function() {
      console.log("map callback called");
      const map = new google.maps.Map(document.createElement("div"));
      const placesApi = new google.maps.places.PlacesService(map);
      setApi(new PlacesApi(placesApi));
    }
    document.body.appendChild(script);
  });

  return api;
}

type PlacesQuery = {
  term: string;
  type: string;
  location: google.maps.LatLng | google.maps.LatLngLiteral; // TODO: get from lib
  radius: number;
}

class PlacesApi {
  private _service: google.maps.places.PlacesService;
  constructor(service: google.maps.places.PlacesService) {
    this._service = service;
  }

  async search(query: PlacesQuery): Promise<PendingOption[]> {
    return new Promise((res, rej) => {
      this._service.nearbySearch({
        type: query.type,
        keyword: query.term,
        location: query.location,
        rankBy: google.maps.places.RankBy.PROMINENCE,
        radius: query.radius
      }, (results, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK &&
          status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          return rej(status);
        }

        const mapped = results?.map(place => placeToOption(place)) || [];

        console.log({ results, mapped });

        res(mapped);
      })
    });
  }
}

const placeToOption = (place: google.maps.places.PlaceResult): PendingOption => ({
  name: place.name || "NAME NOT FOUND",
  description: "TODO",
  uri: place.url || "TODO",
  img: getImg(place.photos) || place.icon || "TODO: data url for placeholder",
  infoItems: mapInfoItems(place)
});

const getImg = (options: google.maps.places.PlacePhoto[] | undefined) => {
  if (!options || options.length === 0) return;

  return options[0].getUrl();
};

const mapInfoItems = (place: google.maps.places.PlaceResult): InfoItem[] => {
  const items: InfoItem[] = [];
  const openStatus = place.opening_hours?.isOpen();
  const knowOpen = typeof openStatus === "boolean";
  if (knowOpen) {
    items.push({
      text: openStatus ? "open" : "closed",
      icon: openStatus ? "check" : "cancel"
    });
  }

  if (place.opening_hours?.periods) {
    for (const period of place.opening_hours.periods) {
      const open = fmtTime(period.open);
      const close = period.close ? ` - ${fmtTime(period.close)}` : "";
      items.push({
        text: open + close,
        icon: "clock"
      });
    }
  } else {
    items.push({
      text: "Hours not available",
      icon: "remove"
    })
  }

  return items;
};

const days = [ // BIG TODO: get index offset from google docs!
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

const fmt24 = (hhmm: string): string => {
  const [hh, mm] = [hhmm.slice(0, 2), hhmm.slice(2)];
  const hhInt = parseInt(hh);
  const modded = hhInt % 12;
  const amPm = hhInt >= 12 ? "pm" : "am";

  return `${modded}:${mm} ${amPm}`;
}

const fmtTime = (time: google.maps.places.PlaceOpeningHoursTime) => {

  return `${days[time.day]} ${fmt24(time.time)}`;
}