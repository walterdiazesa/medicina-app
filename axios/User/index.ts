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
