"use client";
import { useEffect } from "react";
import {IP_LOCATION_URL, userLocationLocalStorage, displayLocationLocalStorage} from "../../constant/constants";
import { fetchData} from "../../utils/axios";

const setLocationToDb = async (locationString : string) => {
  try {
    await fetchData(`/location/setlocation?locationString=${locationString}`);
  } catch {
  }
};

const CurrentLocation = () => {
  useEffect(() => {
    const fetchIPBasedLocation = async () => {
      try {
        const userLocation = localStorage.getItem(userLocationLocalStorage);
        if(!userLocation)
        {
            const response = await fetch(IP_LOCATION_URL);
            const data = await response.json();
            const displayLocation = data.city + ", " + data.region;
            const stringfiedData = JSON.stringify(data);
            localStorage.setItem(userLocationLocalStorage, stringfiedData);
            localStorage.setItem(displayLocationLocalStorage, displayLocation);
            setLocationToDb(stringfiedData);
          }
      } catch {
      }
    };

    fetchIPBasedLocation();
  }, []);

  return null;
};

export default CurrentLocation;
