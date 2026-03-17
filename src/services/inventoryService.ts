import { type Inventory, type InventoryStatistics } from "../types/inventory";
import { type InventoryDetails } from "../types/inventoryDetails";
import { api } from "./api";

export const getLatestInventories = async () => {
  const res = await api.get<Inventory[]>(`inventory/latest`);
  return res.data;
};

export const getPopularInventories = async () => {
  const res = await api.get<Inventory[]>(`inventory/popular`);
  return res.data;
};

export const getInventory = async (id: string) => {
  const res = await api.get<InventoryDetails>(`/inventory/${id}`);
  return res.data;
};

export const getUserInventories = async () => {
  const res = await api.get<Inventory[]>(`/user/inventories`);
  return res.data;
};

export const createInventory = async (data: {
  title: string;
  description: string;
  categoryId: string;
  isPublic: boolean;
}) => {
  const res = await api.post(`/inventory`, data);
  return res.data;
};

export const updateInventory = async (id: string, data: any) => {
  await api.put(`/inventory/${id}`, data);
};

export const deleteInventory = async (ids: string[]) => {
  await api.delete(`/inventory`, {
    data: ids,
  });
};

export const getInventoryStatistics = async (
  id: string,
): Promise<InventoryStatistics> => {
  const res = await api.get<InventoryStatistics>(`/inventory/${id}/statistics`);
  return res.data;
};

export const searchInventories = async (
  query: string,
): Promise<Inventory[]> => {
  const res = await api.get<Inventory[]>(
    `/inventory/search?q=${encodeURIComponent(query)}`,
  );
  return res.data;
};

export const getInventoriesByTag = async (
  tag: string,
): Promise<Inventory[]> => {
  const res = await api.get<Inventory[]>(
    `/inventory/by-tag?tag=${encodeURIComponent(tag)}`,
  );
  return res.data;
};

export const addUserToAccessList = async (
  inventoryId: string,
  userIdBeingAdded: string,
): Promise<void> => {
  await api.put(
    `/inventory/${inventoryId}/access-list`,
    JSON.stringify(userIdBeingAdded),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const removeUserFromAccessList = async (
  inventoryId: string,
  userId: string,
): Promise<void> => {
  await api.delete(`/inventory/${inventoryId}/access-list/${userId}`);
};
