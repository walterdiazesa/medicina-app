import { api } from "..";

export async function requestPutObjectURL() {
  return (await api.get(`/files/upload`)).data as string;
}
