import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: {}, // { documentId: [messages] }
  currentConversation: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Load chat history
    loadChatHistoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadChatHistorySuccess: (state, action) => {
      const { documentId, messages } = action.payload;
      state.loading = false;
      state.conversations[documentId] = messages;
      state.currentConversation = messages;
    },
    loadChatHistoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Send message
    sendMessageStart: (state, action) => {
      const userMessage = {
        id: Date.now(),
        text: action.payload.text,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      state.currentConversation.push(userMessage);
      state.loading = true;
    },
    sendMessageSuccess: (state, action) => {
      const { documentId, message } = action.payload;
      const aiMessage = {
        id: Date.now() + 1,
        text: message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      state.loading = false;
      state.currentConversation.push(aiMessage);
      state.conversations[documentId] = state.currentConversation;
    },
    sendMessageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      // Remove the last user message on failure
      state.currentConversation.pop();
    },
    
    // Set current conversation
    setCurrentConversation: (state, action) => {
      const documentId = action.payload;
      state.currentConversation = state.conversations[documentId] || [];
    },
    
    // Clear conversation
    clearConversation: (state, action) => {
      const documentId = action.payload;
      if (documentId) {
        delete state.conversations[documentId];
        state.currentConversation = [];
      }
    },
    
    // Clear all conversations
    clearAllConversations: (state) => {
      state.conversations = {};
      state.currentConversation = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadChatHistoryStart,
  loadChatHistorySuccess,
  loadChatHistoryFailure,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  setCurrentConversation,
  clearConversation,
  clearAllConversations,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
