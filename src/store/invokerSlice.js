import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  url: '',
  method: 'GET',
  params: [{ key: '', value: '' }],
  headers: [{ key: '', value: '' }],
  body: '',
  response: null,
  collections: [],
  history: [],
  theme: 'dark',
  environment: {},
  environments: {
    default: {},
    development: {},
    staging: {},
    production: {},
  },
  currentEnvironment: 'default',
  tabs: [
    {
      id: 'default',
      url: '',
      method: 'GET',
      params: [{ key: '', value: '' }],
      headers: [{ key: '', value: '' }],
      body: '',
      response: null,
    }
  ],
  activeTabId: 'default',
  favorites: [],
};

const invokerSlice = createSlice({
  name: 'invoker',
  initialState,
  reducers: {
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setMethod: (state, action) => {
      state.method = action.payload;
    },
    setParams: (state, action) => {
      state.params = action.payload;
    },
    setHeaders: (state, action) => {
      state.headers = action.payload;
    },
    setBody: (state, action) => {
      state.body = action.payload;
    },
    setResponse: (state, action) => {
      state.response = action.payload;
    },
    addCollection: (state, action) => {
      state.collections.push(action.payload);
    },
    addToHistory: (state, action) => {
      state.history = [action.payload, ...state.history.slice(0, 9)];
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setEnvironment: (state, action) => {
      const { name, variables } = action.payload;
      state.environments[name] = variables;
    },
    setCurrentEnvironment: (state, action) => {
      state.currentEnvironment = action.payload;
    },
    addTab: (state, action) => {
      const newTab = {
        id: Date.now().toString(),
        url: '',
        method: 'GET',
        params: [{ key: '', value: '' }],
        headers: [{ key: '', value: '' }],
        body: '',
        response: null,
      };
      if (!state.tabs) {
        state.tabs = [];
      }
      state.tabs.push(newTab);
      state.activeTabId = newTab.id;
    },
    removeTab: (state, action) => {
      if (!state.tabs) {
        state.tabs = [];
        return;
      }
      state.tabs = state.tabs.filter(tab => tab.id !== action.payload);
      if (state.activeTabId === action.payload && state.tabs.length > 0) {
        state.activeTabId = state.tabs[0].id;
      }
    },
    setActiveTab: (state, action) => {
      state.activeTabId = action.payload;
    },
    updateTab: (state, action) => {
      const { id, ...updates } = action.payload;
      if (!state.tabs) {
        state.tabs = [];
        return;
      }
      const tabIndex = state.tabs.findIndex(tab => tab.id === id);
      if (tabIndex !== -1) {
        state.tabs[tabIndex] = { ...state.tabs[tabIndex], ...updates };
      }
    },
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
    },
  },
});

export const {
  setUrl,
  setMethod,
  setParams,
  setHeaders,
  setBody,
  setResponse,
  addCollection,
  addToHistory,
  toggleTheme,
  setEnvironment,
  setCurrentEnvironment,
  addTab,
  removeTab,
  setActiveTab,
  updateTab,
  addToFavorites,
  removeFromFavorites,
} = invokerSlice.actions;

export default invokerSlice.reducer;