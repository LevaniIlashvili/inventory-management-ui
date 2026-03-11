export interface Inventory {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  isPublic: boolean;
  tags: string[];
  imageUrl: string | undefined;
}
