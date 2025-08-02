export interface Item {
    id: number,
    sku: string,
    type: string,
    item_name: string,
    variant: string | null,
    qty: number,
    threshold_qty: number
}
