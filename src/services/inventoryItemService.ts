import { api } from "./api";

export const getInventoryItems = async (inventoryId: string) => {
  const res = await api.get(`/api/inventory/${inventoryId}/items`);
  return res.data;
};

export const addItem = async (data: any) => {
  const res = await api.post(`/api/inventoryitem`, data);
  return res.data;
};

export const updateItem = async (itemId: string, fields: any[]) =>
  api.put(`/api/inventoryitem/${itemId}`, fields);

export const deleteItems = async (ids: string[]) =>
  api.delete(`/api/inventoryitem`, { data: ids });
