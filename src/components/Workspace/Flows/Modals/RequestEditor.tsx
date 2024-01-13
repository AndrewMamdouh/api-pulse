import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Response from '../../Response/ResponsePanel';
import RequestTabGroup from '../../../Tab-Groups/RequestTabGroup';
import { EDIT_REQUEST_PROPERTIES } from '../../../../constants';
import { updateRequest } from '../../../../slices/flowSlice';
import { ApiSampleNode, Pair } from '../../../../models';

type RequestEditorModalProps = {
  flowId: string;
  request: Partial<ApiSampleNode>;
  response: Partial<ApiSampleNode> | null;
  triggerChildEffect: Function;
  isEditable?: boolean;
};

/**
 *  RequestEditorModal Component
 */
const RequestEditorModal = ({
  flowId,
  request,
  response,
  triggerChildEffect,
  isEditable = true,
}: RequestEditorModalProps) => {
  const dispatch = useDispatch();
  const { requestPayload, requestHeaders, parameters } = request;
  const [loading] = useState(false);

  if (!request)
    return <div className="text-red-500">No Request Object Passed</div>;

  /**
   * Update Request Modal State
   */
  const handleRequestStateChange = (updates: Partial<ApiSampleNode>) => {
    if (!request.nodeId) {
      console.error("Can't find id property of the selected request object");
      return;
    }

    dispatch(updateRequest({ flowId, updates, nodeId: request.nodeId }));
  };

  return (
    <div>
      <div className="text-lg font-bold">
        <span
          className={`mr-2 text-lg method ${(
            request.method || ''
          ).toLowerCase()}`}
        >
          {request.method}
        </span>
        {request.rawUri}
      </div>
      <div className="flex-1">
        <div className="italic">{EDIT_REQUEST_PROPERTIES}</div>
        <div className="flex gap-[10px]">
          <RequestTabGroup
            tests={request.javaScripts?.tests || ''}
            doc={requestPayload || '{}'}
            headers={requestHeaders || {}}
            queryParams={parameters || {}}
            script={request.javaScripts?.preRequestScript || ''}
            sessionPRS={request.javaScripts?.sessionPRS || ''}
            sessionTests={request.javaScripts?.sessionTests || ''}
            setTestsScript={(tests: string) =>
              handleRequestStateChange({
                javaScripts: {
                  tests,
                  preRequestScript: request.javaScripts?.preRequestScript || '',
                  sessionPRS: request.javaScripts?.sessionPRS || '',
                  sessionTests: request.javaScripts?.sessionTests || '',
                },
              })
            }
            setPreRequestScript={(preRequestScript: string) =>
              handleRequestStateChange({
                javaScripts: {
                  preRequestScript,
                  tests: request.javaScripts?.tests || '',
                  sessionPRS: request.javaScripts?.sessionPRS || '',
                  sessionTests: request.javaScripts?.sessionTests || '',
                },
              })
            }
            setSessionPRS={(sessionPRS: string) =>
              handleRequestStateChange({
                javaScripts: {
                  sessionPRS,
                  tests: request.javaScripts?.tests || '',
                  preRequestScript: request.javaScripts?.preRequestScript || '',
                  sessionTests: request.javaScripts?.sessionTests || '',
                },
              })
            }
            setSessionTests={(sessionTests: string) =>
              handleRequestStateChange({
                javaScripts: {
                  sessionTests,
                  tests: request.javaScripts?.tests || '',
                  preRequestScript: request.javaScripts?.preRequestScript || '',
                  sessionPRS: request.javaScripts?.sessionPRS || '',
                },
              })
            }
            setQueryParams={(parameters: Pair<string[]>) =>
              handleRequestStateChange({ parameters })
            }
            setHeaders={(requestHeaders: Pair) =>
              handleRequestStateChange({ requestHeaders })
            }
            setDoc={(requestPayload: string) =>
              handleRequestStateChange({ requestPayload })
            }
            isEditable={isEditable}
          />

          <Response
            response={response}
            data={response?.responsePayload || '{}'}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestEditorModal;
