import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  FlowComparisonsReportOverViewType,
  FlowOverviewProjectionDTO,
} from '../models/reportModel';

type RecordState = FlowOverviewProjectionDTO;

const initialState: RecordState = {
  id: '',
  payloadRecordRequestId: '',
  createdAt: '',
  type: FlowComparisonsReportOverViewType.RECORD,
  name: '',
};

export const recordSlice = createSlice({
  name: 'FlowOverviewProjection',
  initialState,
  reducers: {
    /**
     *
     */
    setRecord(
      state: RecordState,
      action: PayloadAction<FlowOverviewProjectionDTO>
    ) {
      return { ...action.payload };
    },
  },
});

export const { setRecord } = recordSlice.actions;
export default recordSlice.reducer;
