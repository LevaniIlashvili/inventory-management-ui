export interface InventoryDetails {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  categoryId: string;
  imageUrl?: string;
  isPublic: boolean;
  tags: InventoryTag[];
  customFields: InventoryCustomField[];
}

export interface InventoryTag {
  id: string;
  name: string;
}

export interface InventoryCustomField {
  id: string;
  name: string;
  type: string;
}
