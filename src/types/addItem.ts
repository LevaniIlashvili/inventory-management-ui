export interface AddCustomFieldValue {
  inventoryCustomFieldId: string;
  value?: string;
}

export interface AddInventoryItemRequest {
  inventoryId: string;
  customFieldValues: AddCustomFieldValue[];
}
