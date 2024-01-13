import { AxiosResponse } from 'axios';
import axiosClient from './axiosClient';

const DELETE_WORKFLOW = '/api/v1/mirror/workflow';

/**
 *  Remove Saved Flow (WorkFlow)
 */
export const removeWorkFlow = async (id: string): Promise<boolean | null> => {
  const url = `${DELETE_WORKFLOW}/${id}`;
  try {
    const response: AxiosResponse<boolean> = await axiosClient().delete(url);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
