export const IP = import.meta.env.VITE_IP;
export const weatherAPI = import.meta.env.VITE_WEATHER_API;

export const API_BASE = window.location.protocol === "https:"
    ? "/api"
    : `http://${IP}:3000/api`;