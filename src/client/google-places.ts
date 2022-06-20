import { useEffect, useState } from "react";
import { merge } from "lodash";
import { GOOGLE_API_KEY } from "../consts";
import { Option, PendingOption } from "../models";

export interface PlaceInfo {
  link?: string;
  open?: boolean;
  openingHours?: string[];
  totalRatings?: number;
  rating?: number;
  priceLevel?: number;
}

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

  async search(query: PlacesQuery): Promise<PendingOption<google.maps.places.PlaceResult, PlaceInfo>[]> {
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

        res(mapped);
      })
    });
  }

  async getDetails(place: google.maps.places.PlaceResult): Promise<PendingOption<google.maps.places.PlaceResult, PlaceInfo>> {
    const details: google.maps.places.PlaceResult = await new Promise((res, rej) => {
      this._service.getDetails({
        placeId: place.place_id!,
        fields: ['rating', 'price_level', 'user_ratings_total', 'website']
      }, (response, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return rej(status);
        }

        res(response as google.maps.places.PlaceResult);
      });
    });

    const merged = merge(place, details);

    return placeToOption(merged);
  }
}

const placeToOption = (place: google.maps.places.PlaceResult): PendingOption<google.maps.places.PlaceResult, PlaceInfo> => ({
  name: place.name || "NAME NOT FOUND",
  description: "TODO: place description",
  uri: place.website || "TODO: get uri",
  img: getImg(place.photos) || "TODO: data url for placeholder",
  info: mapInfoItems(place),
  original: place,
});

const getImg = (options: google.maps.places.PlacePhoto[] | undefined) => {
  if (!options || options.length === 0) return;

  return options[0].getUrl();
};

const mapInfoItems = (place: google.maps.places.PlaceResult): PlaceInfo => {
  const info: PlaceInfo = {};
  const openStatus = place.opening_hours?.isOpen();
  const knowOpen = typeof openStatus === "boolean";

  if (knowOpen) {
    info.open = openStatus;
  }

  if (place.opening_hours?.periods) {
    info.openingHours = [];
    for (const period of place.opening_hours.periods) {
      const open = fmtTime(period.open);
      const close = period.close ? ` - ${fmtTime(period.close)}` : "";
      info.openingHours.push(open + close);
    }
  }

  info.totalRatings = place.user_ratings_total;

  info.rating = place.rating;

  info.priceLevel = place.price_level;

  info.link = place.website;

  return info;
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