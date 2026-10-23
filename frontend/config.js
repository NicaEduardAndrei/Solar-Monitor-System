export const IP = import.meta.env.VITE_IP;
export const weatherAPI = import.meta.env.VITE_WEATHER_API;

const isHttps = window.location.protocol === "https:";

export const API_BASE = isHttps ? "/api" : `http://${IP}:3000/api`;
export const WS_BASE = isHttps ? `wss://${IP}` : `ws://${IP}:3000`;