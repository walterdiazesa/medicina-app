import { api } from "..";
import { Patient } from "../../types/Prisma";

export const get = async (query: string) => {
  const { status, data } = await api.get(`/patients/${query}`, {
    withCredentials: true,
  });
  if (status !== 200) return null;
  return data as Patient[];
};
