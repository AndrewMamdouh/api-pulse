import { ApiSample } from './index'; // Adjust the path as needed

export type MethodMap = Map<string, Map<string, ApiSample[]>>;
export type UriMap = Map<string, MethodMap>;
export type ServiceMap = Map<string, UriMap>;
export type EnvMap = Map<string, ServiceMap>;
export type TeamMap = Map<string, EnvMap>;
