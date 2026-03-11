export interface CustomFieldValue {
  fieldId: string;
  value: string;
}

export interface InventoryItem {
  id: string;
  customId: string;
  inventoryId: string;
  createdBy: string;
  createdAt: string;
  customFieldValues: CustomFieldValue[];
}
