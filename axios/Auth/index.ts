import { api } from "..";
import { Auth } from "../../types/Auth";
import { ResponseError, ResponseErrorData } from "../../types/Responses";

export async function auth() {
  const { status, data } = await api.post(
    `/auth`,
    {},
    { withCredentials: true }
  );
  if (status === 200) {
    return data as Auth;
  } else {
    return null;
  }
}
export async function login(username: string, password: string) {
  const { status, data } = await api.post(
    `/auth/login`,
    {
      username,
      password,
    },
    { withCredentials: true }
  );
  return status === 200 ? (data as Auth) : new ResponseError(data);
}
export async function logout() {
  await api.post(`/auth/logout`, {}, { withCredentials: true });
}
export async function changePassword(body: {
  oldPassword: string;
  newPassword: string;
}) {
  const { status, data } = await api.patch("/auth/password/change", body, {
    withCredentials: true,
  });
  if (status !== 200) return new ResponseError(data);
  return data as boolean;
}
