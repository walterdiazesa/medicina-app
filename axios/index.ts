import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_API_HOST!;

export const api = axios.create({
  baseURL,
  validateStatus: (status) => true,
});
