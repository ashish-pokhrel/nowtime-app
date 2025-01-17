"use client";
import { useEffect } from "react";
import {IP_LOCATION_URL, userLocationLocalStorage, displayLocationLocalStorage, userCountryLocalStorage} from "../../constant/constants";
import { fetchData} from "../../utils/axios";

const setLocationToDb = async (locationString : string) => {
  try {
    const response = await fetchData(`/location/setlocation?locationString=${locationString}`);
    const country = response?.data.country;
    localStorage.setItem(userCountryLocalStorage, country);
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
            const stringfiedData = JSON.stringify(data);
            localStorage.setItem(userLocationLocalStorage, stringfiedData);
            localStorage.setItem(displayLocationLocalStorage, "All");
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
