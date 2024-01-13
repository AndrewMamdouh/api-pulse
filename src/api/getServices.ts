import { AxiosResponse } from 'axios';
import axiosClient from './axiosClient';
import {
  TrafficDetailsRequestData,
  WorkflowExecuteRequest,
  WorkflowExecuteResponse,
  CollectionsResponse,
} from '../models/requestModels';
import {
  ApiDocumentation,
  ApiOwner,
  ApiSample,
  ApiSampleNode,
} from '../models';
import {
  workFlowRecordRequest,
  workFlowReplayRequest,
} from '../models/requestModels';
import {
  FlowComparisonsReportOverView,
  FlowOverviewProjectionDTO,
} from '../models/reportModel';

//const GET_TRAFFIC_DETAILS_URI = '/api/v1/mirror/getTrafficDetails';
const GET_FLOW_URI = '/api/v1/mirror/workflow?id=';
const EXECUTE_MIRROR_REQUEST_URI = '/api/v1/mirror/execute';
const GET_RECORDED_IDS_LIST = '/api/v1/mirror/workflow/pr/record/list';
const EXECUTE_WORKFLOW_REQUEST_URI = '/api/v1/mirror/workflow/execute';
const WORK_FLOW_RECORD_URI = '/api/v1/mirror/workflow/pr/record/';
const WORK_FLOW_REPLAY_URI = '/api/v1/mirror/workflow/pr/replay';
const UPDATE_API_INFO = '/api/v1/mirror/preference/key';
const GET_API_INFO = '/api/v1/mirror/preference/key';
const GET_API_RECORD_PAYLOAD = '/api/v1/mirror/workflow/pr/record/request';
const CHECK_AUTH = '/api/v1/mirror/ping';
const GET_TRAFFIC_DETAILS2_URI = '/api/v1/mirror/getTrafficDetails2';
const GET_API_OWNERS_URI = '/api/v1/mirror/getApiOwners';

/**
 *  Get API Sample Collections
 */
// export const getTrafficDetails =
//   async (): Promise<AxiosResponse<TrafficDetailsResponse> | null> => {
//     try {
//       const response: AxiosResponse<TrafficDetailsResponse> =
//         await axiosClient().post(
//           GET_TRAFFIC_DETAILS_URI,
//           TrafficDetailsRequestData
//         );
//       return response;
//     } catch (error) {
//       console.error('Error:', error);
//       return null;
//     }
//   };
/**
 *  Get API Sample Collections
 */
export const getTrafficDetails =
  async (): Promise<CollectionsResponse | null> => {
    try {
      const response: AxiosResponse<CollectionsResponse> =
        await axiosClient().post(
          GET_TRAFFIC_DETAILS2_URI,
          TrafficDetailsRequestData
        );
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
/**
 *  Get API Flows
 */
export const getFlowData = async (): Promise<
  WorkflowExecuteRequest[] | null
> => {
  try {
    const response: AxiosResponse<WorkflowExecuteRequest[]> =
      await axiosClient().get(GET_FLOW_URI);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
/**
 * Send Api request from local
 */
export const sendRequestFromLocal = async (
  requestData: Partial<ApiSampleNode>,
  baseUrl: string
): Promise<AxiosResponse<ApiSample>> => {
  const { method, requestPayload, requestHeaders } = requestData;
  const client = axiosClient(baseUrl);
  switch (method) {
    case 'POST':
      return await client.post(baseUrl, requestPayload, {
        headers: requestHeaders,
      });
    case 'PUT':
      return await client.put(baseUrl, requestPayload, {
        headers: requestHeaders,
      });
    case 'DELETE':
      return await client.delete(baseUrl, {
        headers: requestHeaders,
      });
    case 'PATCH':
      return await client.patch(baseUrl, requestPayload, {
        headers: requestHeaders,
      });
    default:
      return await client.get(baseUrl);
  }
};
/**
 *  Send Api Request our server
 */
export const sendMirrorRequest = async (
  requestData: Partial<ApiSampleNode>,
  baseUrl?: string,
  toOurBackend?: boolean
): Promise<AxiosResponse<ApiSample>> => {
  // for (const key in requestData.parameters) {
  //   const value = requestData.parameters[key];
  //   if (!Array.isArray(value)) {
  //     requestData.parameters[key] = [value];
  //   }
  // }
  //try {
  //  const response: AxiosResponse<Partial<ApiSampleNode>> =
  if (!toOurBackend) {
    const { url } = requestData;
    return await sendRequestFromLocal(requestData, url || '');
  }
  return await axiosClient(baseUrl).post(
    baseUrl ? '' : EXECUTE_MIRROR_REQUEST_URI,
    requestData
  );
  // return response.data;
  // } catch (error) {
  //    console.error('Error:', error);
  //   return null;
  // }
};

/**
 *  Execute Flow
 */
export const executeWorkflowRequest = async (
  requestData: WorkflowExecuteRequest
): Promise<WorkflowExecuteResponse | null> => {
  try {
    const response: AxiosResponse<WorkflowExecuteResponse> =
      await axiosClient().post(EXECUTE_WORKFLOW_REQUEST_URI, requestData);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 *  Record Flow
 */
export const workFlowRecord = async (
  requestData: workFlowRecordRequest
): Promise<FlowOverviewProjectionDTO | null> => {
  try {
    const response: AxiosResponse<FlowOverviewProjectionDTO> =
      await axiosClient().post(WORK_FLOW_RECORD_URI, requestData);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

/**
 *  Replay Flow
 */
export const workFlowReplay = async (
  requestData: workFlowReplayRequest
): Promise<FlowComparisonsReportOverView | null> => {
  try {
    const response: AxiosResponse<FlowComparisonsReportOverView> =
      await axiosClient().post(WORK_FLOW_REPLAY_URI, requestData);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

/**
 *  Update API Documentation Info
 */
export const updateApiDocumentation = async (
  apiCompositeKeyId: string,
  requestData: ApiDocumentation
): Promise<Boolean | null> => {
  try {
    const response: AxiosResponse<Boolean> = await axiosClient().put(
      `${UPDATE_API_INFO}/${apiCompositeKeyId}`,
      requestData
    );
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error(
      `Error updating API documentation for ID: ${apiCompositeKeyId}`,
      error
    );

    return null;
  }
};

/**
 *  Get API Documentation Info
 */
export const getApiDocumentation = async (
  id: string
): Promise<ApiDocumentation[] | null> => {
  try {
    const response: AxiosResponse<ApiDocumentation[]> = await axiosClient().get(
      GET_API_INFO,
      {
        params: {
          id, // Composite Key ID
        },
      }
    );

    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error(`Error fetching API documentation for ID: ${id}`, error);
    return null;
  }
};

/**
 *  Get Recorded Ids List
 */
export const getRecordedIdsList = async (): Promise<
  FlowOverviewProjectionDTO[] | null
> => {
  try {
    const response: AxiosResponse<FlowOverviewProjectionDTO[]> =
      await axiosClient().get(GET_RECORDED_IDS_LIST);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

/**
 *  Get Recorded Payload
 */
export const getRecordedPayload = async (
  payloadRecordRequestId: string
): Promise<workFlowRecordRequest | null> => {
  try {
    const response: AxiosResponse<workFlowRecordRequest> =
      await axiosClient().get(
        `${GET_API_RECORD_PAYLOAD}/${payloadRecordRequestId}`
      );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

/**
 *  Validate Auth Headers
 */
export const checkAuth = async (): Promise<AxiosResponse<string> | null> => {
  try {
    const response: AxiosResponse<string> = await axiosClient().get(CHECK_AUTH);
    return response;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

/**
 * Get Api Owners
 */
export const getApiOwners = async (): Promise<ApiOwner[] | null> => {
  try {
    const response: AxiosResponse<ApiOwner[]> = await axiosClient().get(
      GET_API_OWNERS_URI
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
