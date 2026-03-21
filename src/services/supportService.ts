import { api } from "./api";

export const submitSupportTicket = async (
  priority: string,
  summary: string,
  link: string,
  inventoryTitle?: string,
) => {
  const response = await api.post("/support/ticket", {
    priority,
    summary,
    link,
    inventoryTitle,
  });
  return response.data;
};
