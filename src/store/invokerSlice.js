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
      state.environment = action.payload;
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
} = invokerSlice.actions;

export default invokerSlice.reducer;