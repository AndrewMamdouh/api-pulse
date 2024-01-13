import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ApiSampleMappingNode, ApiSampleNode, Flow } from '../models';
import { ComparisonConfig } from '../models/reportModel';
import { v4 as uuidv4 } from 'uuid';
import { ApiChainRequestType } from '../models/requestModels';

export type ModalState<T> =
  | { visible: false }
  | { visible: true; request: T; response?: T };

export type ComparisonEditModal = {
  comparisonConfigs: ComparisonConfig[];
  id: string;
};

interface FlowState {
  flows: Flow[];
  selectedFlows: string[];
  newFlow: Flow;
  requestEditModal: ModalState<ApiSampleNode>;
  comparisonEditModal: ModalState<ComparisonEditModal>;
  requestMapperEditModal: ModalState<ApiSampleMappingNode>;
}

const initialState: FlowState = {
  flows: [],
  selectedFlows: [],
  newFlow: {
    apiSampleConvertorNodes: [],
    apiSampleNodes: [],
    flowName: '',
    id: uuidv4(),
    apiOwnerId: 'some_owner_id',
    apiChainRequestType: ApiChainRequestType.FIXED,
  },
  requestEditModal: {
    visible: false,
  },
  comparisonEditModal: {
    visible: false,
  },
  requestMapperEditModal: {
    visible: false,
  },
};

export const flowSlice = createSlice({
  name: 'flows',
  initialState,
  reducers: {
    /**
     *  Init New Flow Reducer
     */
    initNewFlow: (state) => {
      state.newFlow = {
        apiSampleConvertorNodes: [],
        apiSampleNodes: [],
        flowName: '',
        id: uuidv4(),
        apiOwnerId: 'some_owner_id',
        apiChainRequestType: ApiChainRequestType.FIXED,
      };
    },
    /**
     *  Set New Flow Reducer
     */
    setNewFlow: (state, action: PayloadAction<Flow>) => {
      state.newFlow = action.payload;
    },
    /**
     *  Update New Flow Reducer
     */
    updateNewFlow: (state, action: PayloadAction<Partial<Flow>>) => {
      state.newFlow = {
        ...state.newFlow,
        ...action.payload,
      };
    },
    /**
     *  Add New Node To Flow Reducer
     */
    addNewNodeToFlow: (state, action: PayloadAction<ApiSampleNode>) => {
      if (!state.newFlow) {
        // Initialize a new flow and add the node to it
        state.newFlow = {
          apiSampleConvertorNodes: [],
          apiSampleNodes: [action.payload],
          flowName: '', // You can set a default name or keep it empty
          id: uuidv4(),
          apiOwnerId: 'some_owner_id',
          apiChainRequestType: ApiChainRequestType.FIXED,
        };
      } else {
        // If a flow already exists, add the node to it
        state.newFlow.apiSampleNodes.push({
          ...action.payload,
        });
      }
    },
    /**
     *  Create New Flow Reducer
     */
    createNewFlow: (state) => {
      const newFlow: Flow = {
        apiSampleConvertorNodes: [],
        apiSampleNodes: [],
        flowName: '',
        id: uuidv4(),
        apiOwnerId: 'some_owner_id',
        apiChainRequestType: ApiChainRequestType.FIXED,
      };
      state.flows.push(newFlow);
    },
    /**
     *  Add Node Reducer
     */
    addNode: (
      state,
      action: PayloadAction<{ request: ApiSampleNode; flowId: number }>
    ) => {
      const {
        payload: { flowId, request },
      } = action;

      state.flows[flowId]?.apiSampleNodes?.push({
        ...request,
      });
    },
    /**
     *  Update Request Reducer
     */
    updateRequest: (
      state,
      action: PayloadAction<{
        nodeId: string;
        flowId: string;
        //request: RequestState;
        updates: Partial<ApiSampleNode>;
        // isNew?: boolean;
      }>
    ) => {
      const {
        payload: { nodeId, updates, flowId },
      } = action;
      const flowIdx = flowId
        ? state.flows.findIndex((flow) => flow.id === flowId)
        : -1;
      const apiSampleIdx = flowId
        ? state.flows[flowIdx].apiSampleNodes.findIndex(
            (sampleNode) => sampleNode.nodeId === nodeId
          )
        : state.newFlow.apiSampleNodes.findIndex(
            (sampleNode) => sampleNode.nodeId === nodeId
          );

      if (apiSampleIdx === -1) return;

      let newUpdate: ApiSampleNode;

      if (flowIdx !== -1) {
        newUpdate = {
          ...state.flows[flowIdx].apiSampleNodes[apiSampleIdx],
          ...updates,
          // parameters: convertObjectToKeyValue(
          //   state.flows[flowIdx].apiSampleNodes[apiSampleIdx]
          //     .parameters as Pair<string[]>,
          // ) as KeyValuePair[],
          // requestHeaders: convertObjectToKeyValue(
          //   state.flows[flowIdx].apiSampleNodes[apiSampleIdx]
          //     .requestHeaders as Pair,
          // ) as KeyValuePair[],
        };
        state.flows[flowIdx].apiSampleNodes[apiSampleIdx] = newUpdate;
      } else {
        newUpdate = {
          ...state.newFlow.apiSampleNodes[apiSampleIdx],
          ...updates,
        };
        state.newFlow.apiSampleNodes[apiSampleIdx] = newUpdate;
      }

      state.requestEditModal = {
        visible: true,
        request: newUpdate,
      };
    },
    /**
     *  Open Request Editor Reducer
     */
    openRequestEditor: (
      state,
      action: PayloadAction<{
        request: ApiSampleNode;
        response?: ApiSampleNode;
      }>
    ) => {
      state.requestEditModal = {
        visible: true,
        request: action.payload.request,
        response: action.payload.response,
      };
    },
    /**
     *  Close Request Editor Reducer
     */
    closeRequestEditor: (state) => {
      state.requestEditModal = {
        visible: false,
      };
    },
    /**
     * Open Comparison Editor Reducer
     */
    openComparisonEditor: (
      state,
      action: PayloadAction<{ request: ComparisonEditModal }>
    ) => {
      state.comparisonEditModal = {
        visible: true,
        request: action.payload.request,
      };
    },
    /**
     * Update Comparison Editor Reducer
     */
    updateComparisonEditor: (
      state,
      action: PayloadAction<{ comparisonConfig: ComparisonConfig; id: string }>
    ) => {
      const { comparisonConfig, id } = action.payload;
      const matchedApiSampleIdx = state.newFlow.apiSampleNodes.findIndex(
        (apiSample) => apiSample.nodeId === id
      );
      if (state.newFlow.apiSampleNodes[matchedApiSampleIdx].comparisonConfigs) {
        const matchedComparisonTypeIdx = state.newFlow.apiSampleNodes[
          matchedApiSampleIdx
        ].comparisonConfigs.findIndex(
          (config) => config.type === comparisonConfig.type
        );
        if (matchedComparisonTypeIdx !== -1) {
          state.newFlow.apiSampleNodes[
            matchedApiSampleIdx
          ].comparisonConfigs.splice(
            matchedComparisonTypeIdx,
            1,
            comparisonConfig
          );
        } else {
          state.newFlow.apiSampleNodes[
            matchedApiSampleIdx
          ].comparisonConfigs.push(comparisonConfig);
        }
      } else {
        state.newFlow.apiSampleNodes[matchedApiSampleIdx].comparisonConfigs = [
          comparisonConfig,
        ];
      }
      state.comparisonEditModal = {
        visible: true,
        request: {
          id,
          comparisonConfigs:
            state.newFlow.apiSampleNodes[matchedApiSampleIdx].comparisonConfigs,
        },
      };
    },
    /**
     * Close Comparison Editor Reducer
     */
    closeComparisonEditor: (state) => {
      state.comparisonEditModal = {
        visible: false,
      };
    },
    /**
     *  Open Request Mapper Editor Reducer
     */
    openRequestMapperEditor: (
      state,
      action: PayloadAction<{ request: ApiSampleMappingNode }>
    ) => {
      state.requestMapperEditModal = {
        visible: true,
        request: action.payload.request,
      };
    },
    /**
     *  Close Request Mapper Editor Reducer
     */
    closeRequestMapperEditor: (state) => {
      state.requestMapperEditModal = {
        visible: false,
      };
    },
    /**
     *  Create API Sample Converter Reducer
     */
    createApiSampleConvertor: (
      state,
      action: PayloadAction<{
        flowId: number;
        converter: ApiSampleMappingNode;
      }>
    ) => {
      const {
        payload: { flowId, converter },
      } = action;
      state.flows[flowId]?.apiSampleConvertorNodes?.push(converter);
    },
    /**
     *  Create API Sample Converter For New Flow Reducer
     */
    createApiSampleConvertorForNewFlow: (
      state,
      action: PayloadAction<{
        flowId: number;
        converter: ApiSampleMappingNode;
      }>
    ) => {
      const {
        payload: { converter },
      } = action;
      state.newFlow?.apiSampleConvertorNodes?.push(converter);
    },
    /**
     *  Update API Sample Converter For New Flow Reducer
     */
    updateApiSampleConvertorForNewFlow: (
      state,
      action: PayloadAction<{
        //flowId: number;
        edgeId: string;
        updates: Partial<ApiSampleMappingNode>;
      }>
    ) => {
      const {
        payload: { updates: converter, edgeId },
      } = action;

      if (!state.newFlow || !state.newFlow.apiSampleConvertorNodes) {
        console.error('newFlow or apiSampleConvertors is not initialized');
        return;
      }

      const converterIndex = state.newFlow.apiSampleConvertorNodes.findIndex(
        (api) => api.nodeId === edgeId
      );

      if (converterIndex === -1) {
        console.warn(`Convertor with nodeId ${edgeId} not found`);
        return;
      }

      const converterObj =
        state.newFlow.apiSampleConvertorNodes[converterIndex];

      state.newFlow.apiSampleConvertorNodes[converterIndex] = {
        ...converterObj,
        ...converter,
      };

      console.log(`Convertor with nodeId ${edgeId} updated`);
    },

    /**
     *  Update API Sample Converter Reducer
     */
    updateApiSampleConvertor: (
      state,
      action: PayloadAction<{
        flowId: number;
        edgeId: string;
        updates: Partial<ApiSampleMappingNode>;
      }>
    ) => {
      const {
        payload: { flowId, updates: converter, edgeId },
      } = action;

      const converterIndex = state.flows[
        flowId
      ].apiSampleConvertorNodes.findIndex((api) => api.nodeId === edgeId);

      const converterObj =
        state.flows[flowId].apiSampleConvertorNodes[converterIndex];

      state.flows[flowId].apiSampleConvertorNodes[converterIndex] = {
        ...converterObj,
        ...converter,
      };
    },
    /**
     *  Update All Flows Reducer
     */
    updateAllFlows: (state, action: PayloadAction<Flow[]>) => {
      state.flows = action.payload;
    },
    /**
     *  Add Selected Flow Reducer
     */
    addSelectedFlow: (state, action: PayloadAction<string>) => {
      const { payload: flowId } = action;
      !state.selectedFlows.includes(flowId) && state.selectedFlows.push(flowId);
    },
    /**
     *  Select All Flows Reducer
     */
    addAllToSelectedFlow: (state) => {
      state.selectedFlows = state.flows.map((flow) => flow.id);
    },
    /**
     *  Remove Selected Flow Reducer
     */
    removeSelectedFlow: (state, action: PayloadAction<string>) => {
      const { payload: flowId } = action;
      state.selectedFlows = state.selectedFlows.filter((id) => id !== flowId);
    },
  },
});

export const {
  initNewFlow,
  createNewFlow,
  addNode,
  closeRequestEditor,
  openRequestEditor,
  openComparisonEditor,
  updateComparisonEditor,
  closeComparisonEditor,
  updateRequest,
  updateApiSampleConvertor,
  createApiSampleConvertor,
  openRequestMapperEditor,
  closeRequestMapperEditor,
  updateAllFlows,
  setNewFlow,
  updateNewFlow,
  addNewNodeToFlow,
  updateApiSampleConvertorForNewFlow,
  createApiSampleConvertorForNewFlow,
  addSelectedFlow,
  addAllToSelectedFlow,
  removeSelectedFlow,
} = flowSlice.actions;

export default flowSlice.reducer;
