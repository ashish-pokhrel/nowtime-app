"use client";
import { useEffect } from "react";
import {IP_LOCATION_URL, userLocationLocalStorage, displayLocationLocalStorage} from "../../constant/constants";
import { fetchData} from "../../utils/axios";

const fetchGroups = async (locationString : string) => {
  console.log(1);
  try {
    const response = await fetchData(`/location/setlocation?locationString=${locationString}`);
  } catch (err: any) {
  }
};

const CurrentLocation = () => {
  useEffect(() => {
    const fetchIPBasedLocation = async () => {
      try {
        var userLocation = localStorage.getItem(userLocationLocalStorage);
        if(!userLocation)
        {
            const response = await fetch(IP_LOCATION_URL);
            const data = await response.json();
            const displayLocation = data.city + ", " + data.region;
            const stringfiedData = JSON.stringify(data);
            localStorage.setItem(userLocationLocalStorage, stringfiedData);
            localStorage.setItem(displayLocationLocalStorage, displayLocation);
            fetchGroups(stringfiedData);
          }
      } catch (error) {
      }
    };

    fetchIPBasedLocation();
  }, []);

  return null;
};

export default CurrentLocation;
