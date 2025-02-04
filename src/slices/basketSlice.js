import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        addToBasket: (state, action) => {
            state.items.push(action.payload); // More efficient way to add
        },
        removeFromBasket: (state, action) => {
            const index = state.items.findIndex(
                (basketItem) => basketItem.id === action.payload.id
            );
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                console.warn(
                    `Can't remove product (id: ${action.payload.id}) as its not in basket!`
                );
            }

        },
    },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors
export const selectItems = (state) => state.basket.items;
export const selectTotal = (state) =>
    state.basket.items.reduce((total, item) => total + item.price, 0);

export default basketSlice.reducer;