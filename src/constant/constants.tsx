export const EXPIRE_MINUTES = 1;
export const IP_LOCATION_URL = "https://ipinfo.io/json?token=a3ca5fd133d863";

export const accessTokenLocalStorage = "accessToken";
export const userGuidLocalStorage = "userGuid";
export const profileImageLocalStorage = "profileImage";
export const tokenExpiresInLocalStorage = "tokenExpiresIn";
export const userLocationLocalStorage = "userLocation";
export const displayLocationLocalStorage = " displayLocation"
export const userCountryLocalStorage = "userCountry"

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "48728014273-1aad0j7h1ep080sb8hr6bdtt497crb6i.apps.googleusercontent.com";
export const SignalR_URL = process.env.REACT_APP_Signalr_URL ?? 'https://grouphoppers.azurewebsites.net/chatHub';
export const API_URL = process.env.REACT_APP_API_URL ?? 'https://grouphoppers.azurewebsites.net/api';