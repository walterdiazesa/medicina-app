import { api } from "..";
import { Test } from "../../types/Prisma/Test";
import { ResponseError } from "../../types/Responses";

type TestParams = {
  order?: "asc" | "desc";
  limit?: number;
};

export async function get(id: string): Promise<Test | null>;
export async function get(params: TestParams): Promise<Test[] | null>;
export async function get(
  args: string | TestParams
): Promise<Test | Test[] | null> {
  if (typeof args === "string") {
    const { status, data } = await api.get(`/test/${args}`, {
      withCredentials: true,
    });
    if (status !== 200) return null;
    return data as Test;
  }

  const { order, limit } = args;
  const { status, data } = await api.get("/test", {
    params: { order, limit },
    withCredentials: true,
  });
  if (status !== 200) return null;
  return data as Test[];
}

export const isTestAuthorized = async (id: string) => {
  const { data } = await api.get(`/test/${id}/access`, {
    withCredentials: true,
  });
  return data as boolean;
};

export const post = async (test: Test) => {
  const response = await api.post("/test", test);
  if (response.status !== 200) return null;
  return response.data as Test;
};

export const deleteTest = async (id: string) => {
  const { status, data } = await api.delete(`/test/${id}`, {
    withCredentials: true,
  });
  return status === 200 ? true : new ResponseError(data);
};

export const put = async (id: string, data: Partial<Test>) => {
  const { status, data: testData }: { status: number; data: Test | null } =
    await api.patch(`/test/${id}`, data, {
      withCredentials: true,
    });
  return { status, testData };
};
