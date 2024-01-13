import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddEnvRequest, ApiFlowRequest, RequestTypes } from '../models';
import { CollectionApiStatus } from '../models';

export type SelectedRequestState = {
  variants: any[];
  apiStatuses: CollectionApiStatus[];
  requestData: ApiFlowRequest;
  environmentData: AddEnvRequest[];
};

const initialState: SelectedRequestState = {
  apiStatuses: [],
  variants: [],
  requestData: {
    doc: '{}',
    headers: {},
    method: RequestTypes.GET,
    queryParams: {},
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    javaScripts: null,
    apiCompositeKeyId: '',
  },
  environmentData: [],
};

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    /**
     *
     */
    resetRequest: () => initialState,

    /**
     *
     */
    setStatuses: (
      state,
      action: PayloadAction<{ statuses: CollectionApiStatus[] }>
    ) => {
      state.apiStatuses = action.payload.statuses;
    },
    /**
     *
     */
    setVariants: (state, action: PayloadAction<{ variants: any[] }>) => {
      state.variants = action.payload.variants;
    },
    /**
     *
     */
    setEnvironmentData: (state, action: PayloadAction<AddEnvRequest>) => {
      // Push the received object into the environmentData array
      state.environmentData.push(action.payload);
    },
    /**
     *
     */
    setSelectedRequest: (
      state,
      action: PayloadAction<Partial<ApiFlowRequest>>
    ) => {
      console.log(':::::::::::::::::::', action);
      state.requestData = {
        ...state.requestData,
        ...action.payload,
      };
    },
    /**
     *
     */
    resetBodyRequest: (state) => {
      state.requestData = {
        ...state.requestData,
        doc: '{}',
      };
    },
  },
});

export const {
  setStatuses,
  setSelectedRequest,
  setVariants,
  setEnvironmentData,
  resetRequest,
} = requestSlice.actions;

export default requestSlice.reducer;
