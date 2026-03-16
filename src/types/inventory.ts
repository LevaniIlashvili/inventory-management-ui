export interface Inventory {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  isPublic: boolean;
  tags: string[];
  imageUrl: string | undefined;
}

export interface NumericFieldStatistic {
  fieldId: string;
  fieldName: string;
  min: number;
  max: number;
  average: number;
}

export interface StringFieldStatistic {
  fieldId: string;
  fieldName: string;
  topValues: Record<string, number>;
}

export interface InventoryStatistics {
  totalItems: number;
  numericFields: NumericFieldStatistic[];
  stringFields: StringFieldStatistic[];
}
