"use client";
import { useEffect } from "react";
import {IP_LOCATION_URL} from "../../constant/constants";

const CurrentLocation = () => {
  useEffect(() => {
    var userLocation = localStorage.getItem("userLocation");
    const fetchGeolocation = () => {
      if(!userLocation)
        {
          if (navigator.geolocation) {
            // If geolocation is available, get the user's position
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                const location = { latitude, longitude };
                localStorage.setItem("userLocation", JSON.stringify(location));
              },
              (error) => {
                fetchIPBasedLocation();
              }
            );
          } else {
            fetchIPBasedLocation();
          }
      }
    };

    const fetchIPBasedLocation = async () => {
      try {
        const response = await fetch(IP_LOCATION_URL);
        const data = await response.json();
        // const [latitude, longitude] = data.loc.split(",");
        // const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        localStorage.setItem("userLocation", JSON.stringify(data));
      } catch (error) {
      }
    };

    fetchGeolocation();
  }, []);

  return null;
};

export default CurrentLocation;
