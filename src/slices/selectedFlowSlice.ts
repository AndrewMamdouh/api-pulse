import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Flow } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { ApiChainRequestType } from '../models/requestModels';

type SelectedFlowState = Flow;

const initialState: SelectedFlowState = {
  id: uuidv4(),
  apiOwnerId: 'some_owner_id',
  apiSampleConvertorNodes: [],
  apiSampleNodes: [],
  flowName: 'Selected Flow',
  apiChainRequestType: ApiChainRequestType.FIXED,
};

export const selectedFlowSlice = createSlice({
  name: 'selectedFlow',
  initialState,
  reducers: {
    /**
     *  Select Flow Reducer
     */
    setSelectedFlow(state: SelectedFlowState, action: PayloadAction<Flow>) {
      return { ...action.payload };
    },
  },
});

export const { setSelectedFlow } = selectedFlowSlice.actions;
export default selectedFlowSlice.reducer;
