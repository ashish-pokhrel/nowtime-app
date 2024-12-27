"use client";
import { useEffect } from "react";
import {IP_LOCATION_URL, userLocationLocalStorage, displayLocationLocalStorage} from "../../constant/constants";

const CurrentLocation = () => {
  useEffect(() => {
    const fetchIPBasedLocation = async () => {
      try {
        var userLocation = localStorage.getItem(userLocationLocalStorage);
        if(!userLocation)
        {
            const response = await fetch(IP_LOCATION_URL);
            const data = await response.json();
            // const [latitude, longitude] = data.loc.split(",");
            // const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
            const displayLocation = data.city + "," + data.region;
            localStorage.setItem(userLocationLocalStorage, JSON.stringify(data));
            localStorage.setItem(displayLocationLocalStorage, displayLocation);
          }
      } catch (error) {
      }
    };

    fetchIPBasedLocation();
  }, []);

  return null;
};

export default CurrentLocation;
