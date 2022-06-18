import { api } from "..";
import { User } from "../../types/Prisma";
import { ResponseError } from "../../types/Responses";

export async function get(
  lab?: string
): Promise<{ users: User[]; ownersIds: string[] } | null>;
export async function get(lab: string, query: string): Promise<User[] | null>;
export async function get(
  lab?: string,
  query?: string
): Promise<{ users: User[]; ownersIds: string[] } | User[] | null> {
  const { status, data } = await api.get(
    `/users/${lab ? `${lab}/` : ""}${query || ""}`,
    {
      withCredentials: true,
    }
  );
  if (status !== 200) return null;
  return query
    ? (data as User[])
    : (data as { users: User[]; ownersIds: string[] });
}

export async function me() {
  const { status, data } = await api.get("/users/me", {
    withCredentials: true,
  });
  if (status !== 200) return null;
  return data as User;
}

export async function updateMe(body: Partial<User>) {
  const { status, data } = await api.patch("/users/me", body, {
    withCredentials: true,
  });
  return status === 200 ? (data as User) : new ResponseError(data);
}

export async function create(
  inviteHash: string,
  { name, password, profileImg }: { [key: string]: string }
) {
  const { status, data } = await api.post(
    "/users",
    { name, password, profileImg, inviteHash },
    { withCredentials: true }
  );
  if (status !== 201) return new ResponseError(data);
  return data as User;
}
