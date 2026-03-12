import { api } from "./api";

export const getInventoryItems = async (inventoryId: string) => {
  const res = await api.get(`/inventory/${inventoryId}/items`);
  return res.data;
};

export const addItem = async (data: any) => {
  const res = await api.post(`/inventoryitem`, data);
  return res.data;
};

export const updateItem = async (itemId: string, fields: any[]) =>
  api.put(`/inventoryitem/${itemId}`, fields);

export const deleteItems = async (ids: string[]) =>
  api.delete(`/inventoryitem`, { data: ids });
