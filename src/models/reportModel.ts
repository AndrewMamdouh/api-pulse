import { ApiSample } from './index';
import { ApiResponseDiffChain, WorkflowExecuteRequest } from './requestModels';
export enum ComparisonType {
  URI = 'URI',
  RESPONSE_BODY = 'RESPONSE_BODY',
  HEADERS = 'HEADERS',
}

export type KeyValuePair = {
  key: string;
  value: string;
};

export type ComparisonConfig = {
  type: ComparisonType;
  ignoredKeys: string[];
  overRidingKeyValues: KeyValuePair[];
};

export interface Difference {
  location: string; // e.g., "URI", "ResponseBody", "RequestHeader", etc.
  key: string; // e.g., specific key in JSON or header name
  expected: string | null;
  current: string | null;
  comparisonType: ComparisonType;
}

export interface ComparisonReportForNode {
  nodeId: string;
  uri: string;
  dataTypeDifferences: Difference[];
  valueDifferences: Difference[];
  missingKeys: Difference[];
  uriDifferences: Difference[];
  extraKeys: Difference[];
  haveDiff: boolean;
  ignoredDiff?: ComparisonReportForNode; // This is optional since it might not always be set
}

export interface BatchApiReport {
  apiOwnerId: string;
  totalSamplesTested: number; // Using number instead of AtomicInteger
  totalSamplesPassed: number;
  newFailuresDetected: number; // These are new failures after PR merged
  passedApiSamples: ApiSample[];
  failedApiSamples: ApiSample[];
  apiCompositeIdVsComparisonReports: { [key: string]: ComparisonReportForNode }; // Using an index signature for the map
}

export interface ComparisonReportForFlow extends BatchApiReport {
  flowName: string;
  haveDiff: boolean;
  nodeComparison: ComparisonReportForNode[];
  isDeleted: boolean;
  id: string;
  ignoredFailuresDetected: number;
}

export enum FlowComparisonsReportOverViewType {
  RECORD = 'RECORD',
  REPLAY = 'REPLAY',
}

export interface ApiCompositeKey {
  id: string;
  apiOwnerId: string;
  method: string;
  pattern: string;
  hasPathVariable: boolean;
  isDeleted: boolean;
  version: number;
}

export interface FlowComparisonsReportOverView extends BatchApiReport {
  id: string;
  expectedApiResponseChain: WorkflowExecuteRequest[];
  apiResponseDiffChains: ApiResponseDiffChain[];
  realFailure: number; // Using number instead of Integer
  flowComparisonList: ComparisonReportForFlow[];
  type: FlowComparisonsReportOverViewType;
  teamEnvSummaryReport: {
    totalNoOfServices: number;
    totalApisPresent: number;
    totalApisTested: number;
    totalApisNotUnderTest: number;
    serviceVsTotalApisTested: { [serviceName: string]: ApiCompositeKey[] };
    serviceVsTotalApisPassed: { [serviceName: string]: ApiCompositeKey[] };
    serviceVsTotalApisFailed: { [serviceName: string]: ApiCompositeKey[] };
    serviceVsTotalApisNotTested: { [serviceName: string]: ApiCompositeKey[] };
  };
}

export type FlowOverviewProjectionDTO = {
  id: string;
  payloadRecordRequestId: string;
  createdAt: string;
  type: FlowComparisonsReportOverViewType;
  name: string;
};

export type RequestData = {
  [key: string]: ApiSample;
};
