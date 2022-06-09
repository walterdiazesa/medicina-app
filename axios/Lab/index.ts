import { api } from "..";
import { Lab, UserType } from "../../types/Prisma";
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

export const patchUsers = async (
  body: { labId: string; user: string },
  type?: "INVITE"
) => {
  const { status, data } = await api.patch(
    "/labs/users",
    { ...body, type },
    {
      withCredentials: true,
    }
  );
  return type
    ? (data as { hash: string; length: number } | UserType)
    : (data as boolean);
};

export const updateOwner = async (body: {
  labId: string;
  owner: string;
  type: "ADD" | "REMOVE";
}) => {
  const { status, data } = await api.patch("/labs/owners", body, {
    withCredentials: true,
  });
  return data as boolean;
};
