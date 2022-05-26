import { api } from "..";
import { Test } from "../../types/Test";

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
    const { status, data } = await api.get(`/test/${args}`);
    if (status !== 200) return null;
    return data as Test;
  }

  const { order, limit } = args;
  const { status, data } = await api.get("/test", { params: { order, limit } });
  if (status !== 200) return null;
  return data as Test[];
}

export const post = async (test: Test) => {
  const response = await api.post("/test", test);
  if (response.status !== 200) return null;
  return response.data as Test;
};
