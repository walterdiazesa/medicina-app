import { api } from "..";
import { Lab } from "../../types/Prisma";
import qs from "qs";

export const getLaboratories = async ({ fields }: { fields?: Object }) => {
  const { status, data } = await api.get("/labs", {
    params: { fields },
    paramsSerializer: (params) => qs.stringify(params),
    withCredentials: true,
  });
  if (status !== 200) return null;
  return data as Lab[];
};

export const createLaboratory = async (labFields: Object) => {
  const { status, data } = await api.post(
    "/labs",
    { ...labFields, img: "https://medicina-app.vercel.app/test-pdf/logo.png" },
    {
      withCredentials: true,
    }
  );
  return { created: status === 201, data };
};
