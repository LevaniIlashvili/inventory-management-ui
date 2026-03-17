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
  customIdElements: CustomIdElement[];
  accessList: string[];
}

export interface InventoryTag {
  id: string;
  name: string;
}

export interface InventoryCustomField {
  id: string;
  title: string;
  description: string;
  type: string;
  shouldBeDisplayed: boolean;
  order: number;
}

export interface CustomIdElement {
  id: string;
  order: number;
  type: string;
  format?: string;
  fixedText?: string;
}
