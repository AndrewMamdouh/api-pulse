import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type baseUrlState = {
  urls: string[];
  selectedUrl?: string;
};

const initialState: baseUrlState = {
  urls: [],
};

export const baseUrlSlice = createSlice({
  name: 'baseUrl',
  initialState,
  reducers: {
    /**
     * Add New Base URL
     */
    AddBaseUrl: (
      state: baseUrlState,
      action: PayloadAction<{ newUrl: string }>
    ) => {
      const { urls } = state;
      const { newUrl } = action.payload;

      if (urls.find((url) => url === newUrl)) return;

      state.urls = [...urls, newUrl];
    },
    /**
     * Edit Certain Base URL
     */
    EditBaseUrl: (
      state: baseUrlState,
      action: PayloadAction<{ oldBaseUrl: string; newBaseUrl: string }>
    ) => {
      const { urls, selectedUrl } = state;
      const { oldBaseUrl, newBaseUrl } = action.payload;

      state.urls = urls.map((url) => (url !== oldBaseUrl ? url : newBaseUrl));

      if (selectedUrl === oldBaseUrl) state.selectedUrl = newBaseUrl;
    },
    /**
     * Remove Certain Base URL
     */
    removeBaseUrl: (
      state: baseUrlState,
      action: PayloadAction<{ baseUrl: string }>
    ) => {
      const { urls, selectedUrl } = state;
      const { baseUrl } = action.payload;

      state.urls = urls.filter((url) => url !== baseUrl);

      if (baseUrl === selectedUrl) state.selectedUrl = undefined;
    },
    /**
     * Select Certain Base URL
     */
    selectBaseUrl: (
      state: baseUrlState,
      action: PayloadAction<{ baseUrl: string }>
    ) => {
      const { urls } = state;
      const { baseUrl } = action.payload;

      if (urls.find((url) => url === baseUrl)) state.selectedUrl = baseUrl;
    },
  },
});

export const { AddBaseUrl, EditBaseUrl, removeBaseUrl, selectBaseUrl } =
  baseUrlSlice.actions;
export default baseUrlSlice.reducer;
