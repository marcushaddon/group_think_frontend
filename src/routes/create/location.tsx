import React, { useState} from "react";

const cached = window.localStorage.getItem("group_think-location");

export const useLocation = () => {
  const [location, setLocation] = useState<GeolocationPosition | undefined>(
    cached ? JSON.parse(cached) as GeolocationPosition : undefined
  );

  const wrappedSetter = (location: GeolocationPosition) => {
    window.localStorage.setItem(
      "group_think-location",
      JSON.stringify({
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      }, null, 2)
    );
    setLocation(location);
  }

  return [location, wrappedSetter] as [
    GeolocationPosition | undefined,
    (location: GeolocationPosition) => void
  ];
};
