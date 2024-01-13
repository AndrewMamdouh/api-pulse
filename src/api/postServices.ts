import { AxiosResponse } from 'axios';
import axiosClient from './axiosClient';
import { WorkflowExecuteRequest } from '../models/requestModels';

const SAVE_FLOW = '/api/v1/mirror/workflow/save';
const UPDATE_WORKFLOW = '/api/v1/mirror/workflow';

/**
 *  Save New Flow
 */
export const saveFlow = async (
  flow: [WorkflowExecuteRequest]
): Promise<[string] | null> => {
  try {
    const response: AxiosResponse<[string]> = await axiosClient().post(
      SAVE_FLOW,
      flow
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 *  Update Saved Flow (WorkFlow)
 */
export const updateWorkFlow = async (
  flow: WorkflowExecuteRequest
): Promise<WorkflowExecuteRequest | null> => {
  try {
    const response: AxiosResponse<WorkflowExecuteRequest> =
      await axiosClient().put(UPDATE_WORKFLOW, flow);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// flowgroup/save
// flowgroup/all
