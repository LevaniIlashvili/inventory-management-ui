import type { User } from "../types/user";
import { api } from "./api";

const API = "/user";

export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await api.get(
    `${API}/search?q=${encodeURIComponent(query)}`,
  );
  return response.data;
};

export const getUsers = async () => {
  const res = await api.get(API);
  return res.data;
};

export const deleteUsers = async (ids: string[]) =>
  api.delete(API, { data: ids });

export const blockUsers = async (ids: string[]) =>
  api.post(`${API}/block`, ids);

export const unblockUsers = async (ids: string[]) =>
  api.post(`${API}/unblock`, ids);

export const grantAdmins = async (ids: string[]) =>
  api.post(`${API}/grant-admin`, ids);

export const revokeAdmins = async (ids: string[]) =>
  api.post(`${API}/revoke-admin`, ids);
