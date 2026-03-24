import { api } from "./api";

export const syncToSalesforce = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  phone?: string;
}) => {
  const response = await api.post("/crm/sync", data);
  return response.data;
};
