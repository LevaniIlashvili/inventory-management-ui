import { api } from "./api";

export interface CustomIdElement {
  id?: string;
  type: string;
  order: number;
  fixedText?: string;
  format?: string;
}

export const addCustomIdElement = async (inventoryId: string, data: any) => {
  const res = await api.post(
    `/inventory/${inventoryId}/custom-id-elements`,
    data,
  );
  return res.data;
};

export const updateCustomIdElement = async (
  inventoryId: string,
  elementId: string,
  data: any,
) => {
  await api.put(
    `/inventory/${inventoryId}/custom-id-elements/${elementId}`,
    data,
  );
};

export const deleteCustomIdElements = async (
  inventoryId: string,
  ids: string[],
) => {
  await api.delete(`/inventory/${inventoryId}/custom-id-elements`, {
    data: ids,
  });
};
