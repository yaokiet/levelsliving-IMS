export interface Item {
    id: number,
    sku: string,
    type: string,
    item_name: string,
    variant: string | null,
    qty: number,
    threshold_qty: number,
    // status: string
}




export interface ItemCreate {
  sku: string;
  type: string;
  item_name: string;
  variant?: string | null;
  qty: number;
  threshold_qty: number;
}

export type ItemUpdate = Partial<Omit<Item, "id" | "createdAt" | "updatedAt" | "components">>;

export interface ComponentDetail extends Item {
  qty_required: number;
}

export interface ItemWithComponents extends Item {
  components: ComponentDetail[];
}