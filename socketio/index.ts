import { io } from "socket.io-client";
import { baseURL } from "../axios";
import { EventType } from "../types/Socketio";

export const socket = io(baseURL.replace("http", "ws").replace("https", "ws"));
export const listen = (
  event: EventType,
  listener: (...args: any[]) => void
) => {
  socket.on(event, listener);
};
