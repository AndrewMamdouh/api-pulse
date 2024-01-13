import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../../../utils/helpers';
import { RootState } from '../../../store'; // Adjust the path if necessary
import {
  ApiFlowRequest,
  ApiSample,
  RequestTypes,
  CollectionApiStatus,
} from '../../../models';

export type VariantsPanelProps = {
  /**
   *  setRequest Function Type
   */
  setRequest: (request: Partial<ApiFlowRequest>) => void;
};

/**
 *  VariantsPanel Component
 */
const VariantsPanel = ({ setRequest }: VariantsPanelProps) => {
  const request = useSelector((state: RootState) => state.selectedRequest);

  /**
   *
   */
  const handlePopulate = (requestData: ApiSample) => {
    const {
      scheme,
      hostName,
      port,
      rawUri,
      method,
      requestHeaders,
      parameters,
      requestPayload,
    } = requestData;

    const completeUrl = `${scheme}://${hostName}:${port}${rawUri}`;

    setRequest({
      method: RequestTypes[method as keyof typeof RequestTypes],
      url: completeUrl,
      doc: requestPayload || '{}',
      headers: requestHeaders || {},
      queryParams: parameters || {},
    });
  };

  /**
   *
   */
  const sortRequestData = (apiStatuses: CollectionApiStatus[]) =>
    apiStatuses
      .map((apiStatus) => apiStatus.requestData)
      .flat()
      .sort(
        (sampleA, sampleB) =>
          new Date(sampleB.timestamp).getTime() -
          new Date(sampleA.timestamp).getTime()
      );

  return (
    <div
      className="pl-3 border-r-2 h-[90vh] overflow-scroll"
      style={{ flex: '0 0 180px' }}
    >
      <p className="text-secondary-400">Status Variants</p>

      {request?.apiStatuses.length ? (
        <div className="flex flex-col gap-[4px] items-start my-3">
          {request?.apiStatuses.map((apiStatus, index) => (
            <button
              key={index}
              className={`variant-btn text-${
                apiStatus.statusCode >= 200 && apiStatus.statusCode < 300
                  ? 'lime'
                  : 'rose'
              }-600`}
              onClick={() => handlePopulate(apiStatus.requestData[0])}
            >
              {apiStatus.statusCode}
            </button>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col gap-[4px] items-start my-3"
          style={{ pointerEvents: 'none' }}
        >
          <button className={`variant-btn text-rose-600`}>No Statuses</button>
        </div>
      )}

      <p className="text-secondary-400">Recents</p>
      <div className="flex flex-col gap-[4px] items-start my-3">
        {sortRequestData(request?.apiStatuses).map((apiStatus, index) => (
          <button
            key={index}
            className="variant-btn"
            onClick={() => handlePopulate(apiStatus)}
          >
            {formatDate(apiStatus.timestamp)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantsPanel;
