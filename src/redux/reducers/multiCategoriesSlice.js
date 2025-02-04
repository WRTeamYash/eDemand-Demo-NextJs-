// src/redux/slices/multiCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategories: [], // Store categories as an array of objects
};

const multiCategoriesSlice = createSlice({
  name: "multiCategories",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const category = action.payload; // { id, name, slug }
      // Avoid duplicate categories
      if (!state.selectedCategories.find((cat) => cat?.id === category?.id)) {
        state.selectedCategories.push(category);
      }
    },
    removeCategory: (state, action) => {
      const categoryId = action.payload;
      state.selectedCategories = state.selectedCategories.filter(
        (cat) => cat.id !== categoryId
      );
    },
    removeCategoryBySlug: (state, action) => {
      const categorySlug = action.payload;
      // Find the index of the category with the matching slug
      const index = state.selectedCategories.findIndex(
        (cat) => cat.id === categorySlug
      );

      if (index !== -1) {
        // Remove the clicked category and all categories after it
        state.selectedCategories = state.selectedCategories.slice(0, index + 1);
      }
    },
    clearCategories: (state) => {
      state.selectedCategories = [];
    },
  },
});

export const { addCategory, removeCategory,removeCategoryBySlug, clearCategories } =
  multiCategoriesSlice.actions;

export default multiCategoriesSlice.reducer;
