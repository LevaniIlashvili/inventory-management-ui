import { type Inventory } from "../types/inventory";
import { api } from "./api";

const API = "https://localhost:7117/api";

export const getInventory = async (id: string) => {
  const res = await api.get(`${API}/inventory/${id}`);
  return res.data;
};

export const getUserInventories = async () => {
  const res = await api.get<Inventory[]>(`${API}/user/inventories`);
  return res.data;
};

export const createInventory = async (data: {
  title: string;
  description: string;
  categoryId: string;
  isPublic: boolean;
}) => {
  const res = await api.post(`${API}/inventory`, data);
  return res.data;
};

export const updateInventory = async (id: string, data: any) => {
  await api.put(`${API}/inventory/${id}`, data);
};

export const deleteInventory = async (ids: string[]) => {
  await api.delete(`${API}/inventory`, {
    data: ids,
  });
};
