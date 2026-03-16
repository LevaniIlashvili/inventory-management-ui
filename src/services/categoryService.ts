import type { Category } from "../types/category";
import { api } from "./api";

export const getCategories = async () => {
  const res = await api.get<Category[]>(`/category`);
  return res.data;
};
