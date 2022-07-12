import { api } from "..";
import {
  Lab,
  LabSelect,
  LabWithEmployeeInfo,
  UserType,
} from "../../types/Prisma";
import qs from "qs";
import { ResponseError } from "../../types/Responses";

export const mine = async (includeEmployeeInfo?: boolean) => {
  const { status, data } = await api.get("/labs/mine", {
    withCredentials: true,
    ...(includeEmployeeInfo && {
      params: {
        includeEmployeeInfo,
      },
    }),
  });
  if (status !== 200) return null;
  return data as LabWithEmployeeInfo | LabWithEmployeeInfo[];
};

export const getLaboratory = async ({
  id,
  access,
  test,
  fields,
}: {
  id: string;
  access?: string;
  test?: string;
  fields?: LabSelect;
}) => {
  const { status, data } = await api.get(
    `/labs/mine/${id}${access ? `/${access}/${test}` : ""}`,
    {
      params: { fields },
      paramsSerializer: (params) => qs.stringify(params),
      withCredentials: true,
    }
  );
  if (status !== 200) return null;
  return data as Lab;
};

export async function updateLab(labId: string, body: Partial<Lab>) {
  const { status, data } = await api.patch(`/labs/${labId}`, body, {
    withCredentials: true,
  });
  return status === 200 ? (data as Lab) : new ResponseError(data);
}

export const getLaboratories = async ({ fields }: { fields?: LabSelect }) => {
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
  if (status !== 200) return new ResponseError(data);
  return type ? (data as UserType) : (data as boolean);
};

export const updateOwner = async (body: {
  labId: string;
  owner: string;
  type: "ADD" | "REMOVE";
}) => {
  const { status, data } = await api.patch("/labs/owners", body, {
    withCredentials: true,
  });
  return status === 200 ? (data as boolean) : new ResponseError(data);
};
