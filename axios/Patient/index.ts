import { api } from "..";
import { Patient } from "../../types/Prisma";
import { ResponseError } from "../../types/Responses";

export const get = async (query: string) => {
  const { status, data } = await api.get(`/patients/${query}`, {
    withCredentials: true,
  });
  if (status !== 200) return null;
  return data as Patient[];
};

export const create = async (patient: Patient) => {
  const { status, data } = await api.post("/patients", patient, {
    withCredentials: true,
  });
  if (status !== 201) return new ResponseError(data);
  return data as Patient;
};
