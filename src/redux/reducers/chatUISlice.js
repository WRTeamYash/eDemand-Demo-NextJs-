import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatStep: 'list',
  selectedChatId: null, // Will store uniqueId: provider_id_bookingId or provider_id_pre
  selectedChat: null,
  chatType: null, // 'pre' or 'post'
  isAdmin: false, // Track if we're in admin chat
};

const chatUISlice = createSlice({
  name: 'chatUI',
  initialState,
  reducers: {
    setChatStep: (state, action) => {
      state.chatStep = action.payload;
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
      // Update chatType based on the unique identifier
      if (action.payload) {
        state.chatType = action.payload.includes('_pre') ? 'pre' : 'post';
      } else {
        state.chatType = null;
      }
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      // Update chatType based on booking_id
      if (action.payload) {
        state.chatType = action.payload.booking_id ? 'post' : 'pre';
      } else {
        state.chatType = null;
      }
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    resetChatUI: (state) => {
      state.chatStep = 'list';
      state.selectedChatId = null;
      state.selectedChat = null;
      state.chatType = null;
      state.isAdmin = false;
    },
  },
});

// Export actions
export const { setChatStep, setSelectedChatId, setSelectedChat, setIsAdmin, resetChatUI } = chatUISlice.actions;

// Export selectors
export const selectChatUI = (state) => state.chatUI;
export const selectChatStep = (state) => state.chatUI.chatStep;
export const selectSelectedChatId = (state) => state.chatUI.selectedChatId;
export const selectSelectedChat = (state) => state.chatUI.selectedChat;
export const selectChatType = (state) => state.chatUI.chatType;
export const selectIsAdmin = (state) => state.chatUI.isAdmin;

// Export reducer
export default chatUISlice.reducer; 