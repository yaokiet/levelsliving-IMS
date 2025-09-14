export interface Item {
  id: number;
  sku: string;
  type: string;
  item_name: string;
  variant: string | null;
  qty: number;
  threshold_qty: number;
  // status: string
}

export type ItemFormState = {
  item_name: string;
  sku: string;
  variant: string;
  type: string;
  qty: number;
  threshold_qty: number;
};

export interface ItemCreate {
  sku: string;
  type: string;
  item_name: string;
  variant?: string | null;
  qty: number;
  threshold_qty: number;
}

export type ItemUpdate = Partial<
  Omit<Item, "id" | "createdAt" | "updatedAt" | "components">
>;

export interface ComponentDetail extends Item {
  qty_required: number;
}

export interface ItemWithComponents extends Item {
  components: ComponentDetail[];
}

export interface LowestChildDetail {
  id: number;
  sku: string;
  item_name: string;
  total_qty_required: number;
}
