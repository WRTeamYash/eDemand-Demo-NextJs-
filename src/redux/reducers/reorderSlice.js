import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isReOrder: false,
  orderId: null,
  provider: null,
  items: []
};

const reorderSlice = createSlice({
  name: "reorder",
  initialState,
  reducers: {
    setReorderMode: (state, action) => {
      const { isReOrder, orderId, provider, items } = action.payload;
      
      state.isReOrder = isReOrder;
      state.orderId = orderId;
      state.provider = provider;
      state.items = items;
    },
    clearReorder: (state) => {
      return initialState;
    }
  }
});

export const { setReorderMode, clearReorder } = reorderSlice.actions;

// Selectors
export const selectReorderMode = (state) => state.reorder.isReOrder;
export const selectReorderId = (state) => state.reorder.orderId;

export default reorderSlice.reducer;