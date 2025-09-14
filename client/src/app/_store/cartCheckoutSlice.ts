import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cart-item";
import { Supplier } from "@/types/supplier";

interface CartCheckoutState {
    selectedItems: CartItem[];
    selectedSupplier?: Supplier;
}

const initialState: CartCheckoutState = {
    selectedItems: [],
    selectedSupplier: undefined,
};

export const cartCheckoutSlice = createSlice({
    name: "cartCheckout",
    initialState,
    reducers: {
        setSelectedItems: (state, action: PayloadAction<CartItem[]>) => {
            state.selectedItems = action.payload;
        },
        setSelectedSupplier: (state, action: PayloadAction<Supplier>) => {
            state.selectedSupplier = action.payload;
        },
        clearCheckout: (state) => {
            state.selectedItems = [];
            state.selectedSupplier = undefined;
        },
    },
});

export const { setSelectedItems, setSelectedSupplier, clearCheckout } = cartCheckoutSlice.actions;
export default cartCheckoutSlice.reducer;