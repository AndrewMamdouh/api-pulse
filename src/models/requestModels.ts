import {
  ApiSample,
  ApiOwner,
  ApiSampleNode,
  ApiSampleMappingNode,
  ApiOwnerTrafficCollection,
} from './index';

export enum ApiChainRequestType {
  FIXED = 'FIXED',
  LATEST = 'LATEST',
}

export interface TrafficDetailsResponse {
  id: null | string;
  apiCompositeKeys: null | string[];
  apiSamples: ApiSample[];
  apiOwner: null | ApiOwner;
  name: null | string;
  visibility: null | string; // Adjusted this type as an example, replace with the correct type or enum
  deleted: boolean;
}

const EMPTY_SERVICE_NAME = '';
export const TrafficDetailsRequestData = {
  serviceName: EMPTY_SERVICE_NAME,
};

export type CollectionsResponse = ApiOwnerTrafficCollection[];

/**
 * Save, Update, Execute
 * should be wrapped in array (can send WorkflowExecuteRequest[] in save)
 * rest you should send a single WorkflowExecuteRequest (Update, Execute);
 * need to be added in generatePayload Function
 */
export interface WorkflowExecuteRequest {
  // will be renamed to API Chain Request
  apiSampleNodes: ApiSampleNode[];
  apiSampleConvertorNodes: ApiSampleMappingNode[];
  flowName: string;
  id: string;
  apiOwnerId: string;
  sequenceNo?: number;
  groupId?: string;
  apiChainRequestType: ApiChainRequestType;
}

export type WorkflowExecuteResponse = ApiSampleNode[];

export interface ApiResponseDiffChain {
  expectedApiResponseChain: WorkflowExecuteRequest;
  currentApiResponseChain: WorkflowExecuteRequest;
  flowId: string;
}

export interface workFlowRecordRequest {
  apiResponsesDiffChains: ApiResponseDiffChain[];
  name: string;
}

export interface workFlowReplayRequest {
  apiChainListToExecuteOnPr: WorkflowExecuteRequest[];
  flowComparisonsReportOverViewId: string;
}
