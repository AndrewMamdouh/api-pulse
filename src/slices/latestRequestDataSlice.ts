import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RequestData } from '../models/reportModel';
import { ApiSample } from '../models';

const initialState: RequestData = {};

export const requestDataSlice = createSlice({
  name: 'requestData',
  initialState,
  reducers: {
    /**
     *  Set All Latest Request Data
     */
    setLatestRequestData(state, action: PayloadAction<RequestData>) {
      return { ...action.payload };
    },
    /**
     *  Update Latest Request Data For One API
     */
    updateLatestRequestData(state, action: PayloadAction<ApiSample>) {
      const apiSample = action.payload;
      if (apiSample.apiCompositeKeyId) {
        state[apiSample.apiCompositeKeyId] = apiSample;
      }
    },
  },
});

export const { setLatestRequestData, updateLatestRequestData } =
  requestDataSlice.actions;
export default requestDataSlice.reducer;
