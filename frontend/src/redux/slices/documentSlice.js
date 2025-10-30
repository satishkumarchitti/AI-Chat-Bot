import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  currentDocument: null,
  extractedData: null,
  loading: false,
  uploading: false,
  error: null,
  filters: {
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  },
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    // Fetch documents
    fetchDocumentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDocumentsSuccess: (state, action) => {
      state.loading = false;
      state.documents = action.payload;
    },
    fetchDocumentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Upload document
    uploadDocumentStart: (state) => {
      state.uploading = true;
      state.error = null;
    },
    uploadDocumentSuccess: (state, action) => {
      state.uploading = false;
      state.documents = [action.payload, ...state.documents];
      state.currentDocument = action.payload;
    },
    uploadDocumentFailure: (state, action) => {
      state.uploading = false;
      state.error = action.payload;
    },
    
    // Select document
    selectDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    
    // Set extracted data
    setExtractedData: (state, action) => {
      state.extractedData = action.payload;
    },
    
    // Update extracted field
    updateExtractedField: (state, action) => {
      const { field, value } = action.payload;
      if (state.extractedData) {
        state.extractedData[field] = value;
      }
    },
    
    // Delete document
    deleteDocumentSuccess: (state, action) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
      if (state.currentDocument?.id === action.payload) {
        state.currentDocument = null;
        state.extractedData = null;
      }
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear current document
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
      state.extractedData = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  uploadDocumentStart,
  uploadDocumentSuccess,
  uploadDocumentFailure,
  selectDocument,
  setExtractedData,
  updateExtractedField,
  deleteDocumentSuccess,
  updateFilters,
  clearCurrentDocument,
  clearError,
} = documentSlice.actions;

export default documentSlice.reducer;
