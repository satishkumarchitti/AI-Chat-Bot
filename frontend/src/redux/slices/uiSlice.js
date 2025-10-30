import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  panelSizes: {
    left: 35,
    middle: 30,
    right: 35,
  },
  collapsedPanels: {
    left: false,
    middle: false,
    right: false,
  },
  selectedFields: [],
  highlights: [],
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPanelSize: (state, action) => {
      const { panel, size } = action.payload;
      state.panelSizes[panel] = size;
    },
    togglePanel: (state, action) => {
      const panel = action.payload;
      state.collapsedPanels[panel] = !state.collapsedPanels[panel];
    },
    setSelectedFields: (state, action) => {
      state.selectedFields = action.payload;
    },
    addHighlight: (state, action) => {
      state.highlights.push(action.payload);
    },
    removeHighlight: (state, action) => {
      state.highlights = state.highlights.filter(h => h.id !== action.payload);
    },
    clearHighlights: (state) => {
      state.highlights = [];
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    resetUI: () => initialState,
  },
});

export const {
  setPanelSize,
  togglePanel,
  setSelectedFields,
  addHighlight,
  removeHighlight,
  clearHighlights,
  toggleSidebar,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
