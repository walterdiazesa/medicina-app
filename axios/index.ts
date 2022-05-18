import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://medicina-servidor-tu6et.ondigitalocean.app";

export const api = axios.create({
  baseURL,
});
