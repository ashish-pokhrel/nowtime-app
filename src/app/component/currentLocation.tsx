"use client";
import { useEffect } from "react";
import {IP_LOCATION_URL} from "../../constant/constants";

const CurrentLocation = () => {
  useEffect(() => {
    const fetchIPBasedLocation = async () => {
      try {
        var userLocation = localStorage.getItem("userLocation");
        if(!userLocation)
        {
            const response = await fetch(IP_LOCATION_URL);
            const data = await response.json();
            // const [latitude, longitude] = data.loc.split(",");
            // const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
            localStorage.setItem("userLocation", JSON.stringify(data));
          }
      } catch (error) {
      }
    };

    fetchIPBasedLocation();
  }, []);

  return null;
};

export default CurrentLocation;
