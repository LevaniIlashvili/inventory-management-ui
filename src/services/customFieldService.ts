import { api } from "./api";

export const addCustomField = async (inventoryId: string, data: any) => {
  const res = await api.post(`/inventory/${inventoryId}/custom-fields`, data);
  return res.data;
};

export const updateCustomField = async (
  inventoryId: string,
  fieldId: string,
  data: any,
) => {
  await api.put(`/inventory/${inventoryId}/custom-fields/${fieldId}`, data);
};

export const deleteCustomFields = async (
  inventoryId: string,
  ids: string[],
) => {
  await api.delete(`/inventory/${inventoryId}/custom-fields`, { data: ids });
};
