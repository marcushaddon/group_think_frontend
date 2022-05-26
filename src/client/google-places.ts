import { useEffect, useState } from "react";
import { GOOGLE_API_KEY } from "../consts";

export const usePlaces = () => {
  const [api, setApi] = useState<google.maps.places.PlacesService>();

  useEffect(() => {
    if (api) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initMap`;
    (window as any).initMap = function() {
      console.log("map callback called");
      const map = new google.maps.Map(document.createElement("div"));
      const placesApi = new google.maps.places.PlacesService(map);
      setApi(placesApi);
    }
    document.body.appendChild(script);
  });

  return api;
}
