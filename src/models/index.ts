import { ComparisonConfig, KeyValuePair } from './reportModel';
import { WorkflowExecuteRequest } from './requestModels';

export enum RequestTypes {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum VariableLocation {
  PATH_VARIABLE = 'PATH_VARIABLE',
  HEADER_KEY = 'HEADER_KEY',
  REQUEST_BODY = 'REQUEST_BODY',
  QUERY_PARAMETER = 'QUERY_PARAMETER',
}

export type CollectionApiStatus = {
  statusCode: number;
  requestData: ApiSample[];
};

export type CollectionStatus = {
  method: string;
  apiStatuses: CollectionApiStatus[];
};

export type CollectionURI = {
  uriPath: string;
  statuses: CollectionStatus[];
};

export type CollectionApplication = {
  title: string;
  URIs: CollectionURI[];
};

export type CollectionEnv = {
  path: string;
  application: CollectionApplication[];
};

export type Collection = {
  team: string;
  env: CollectionEnv[];
};

export type Env = {
  name: string;
  variables: EnvVariable[];
};

export type EnvVariable = {
  name: string;
  value: string;
  current: string;
};

export type VariableKeyLocation = {
  varKey: string;
  varPath: string;
  varLocation: VariableLocation;
};

export interface ApiOwner {
  id: string;
  env: string;
  team: string;
  serviceName: string;
}
export type ApiCompositeKeyStatusSamples = {
  id: string;
  apiCompositeKeyId: string;
  status: number;
  samples: ApiSample[];
};

export type ApiOwnerTrafficCollection = {
  apiOwner: ApiOwner;
  apiCompositeKeyStatusSamples: ApiCompositeKeyStatusSamples[];
};

export interface Uri {
  uriPath: string;
  hasPathVariable: boolean;
  size: number;
}

export interface JavaScripts {
  preRequestScript: string | null;
  tests: string | null;
  sessionPRS: string | null;
  sessionTests: string | null;
}

export interface ApiFlowRequest {
  url: string;
  method: RequestTypes;
  headers: Pair;
  queryParams: Pair<string[]>;
  doc: string;
  apiCompositeKeyId: string;
  javaScripts: JavaScripts | null;
}

export interface AddEnvRequest {
  name: string;
  initialValue: string;
  currentValue: string;
}

export type Pair<T = string> = Record<string, T>;
export type KeyPairOrArray<T = string> = Pair<T> | Pair<T>[];
export interface ApiSample {
  id: string;
  apiCompositeKeyId: null | string;
  rawUri: string;
  applicationName: string;
  hostName: string;
  port: number;
  scheme: string;
  method: string;
  parameters: Pair<string[]>;
  requestHeaders: Pair;
  responseHeaders: Pair;
  statusCode: number;
  requestPayload: string;
  url: string;
  responsePayload: string;
  uncaughtExceptionMessage: string;
  payloadCaptureAttempted: boolean;
  requestPayloadCaptureAttempted: null | boolean;
  responsePayloadCaptureAttempted: null | boolean;
  latency: null | number;
  uri: Uri;
  timestamp: string;
  apiOwner: ApiOwner;
}

export interface ApiSampleNode extends ApiSample {
  nodeId: string;
  comparisonConfigs: ComparisonConfig[];
  javaScripts: JavaScripts | null;
  envVarPaths: VariableKeyLocation[] | null;
}

export interface Flow extends WorkflowExecuteRequest {}

export interface ApiDocumentation {
  description: string | null;
  what: string | null;
  why: string | null;
  how: string | null;
  who: string | null;
  javaScripts: JavaScripts | null;
  compositeKeyId: string | null;
}

export interface ApiSampleMappingNode {
  nodeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  headerMapping: KeyValuePair[];
  requestBodyMapping: KeyValuePair[];
  queryParamMapping: KeyValuePair[];
}
