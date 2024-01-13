import { useState } from 'react';
import UrlEditor from '../../Panes/RequestUrl/UrlEditor';
import RequestTabGroup from '../../Tab-Groups/RequestTabGroup';
import Response from '../Response/ResponsePanel';
import VariantsPanel from '../../Layout/Variants';
import { sendMirrorRequest } from '../../../api/getServices';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRequest } from '../../../slices/selectedRequestSlice';
import { RootState } from '../../../store';
import {
  ApiDocumentation,
  ApiFlowRequest,
  ApiSample,
  ApiSampleNode,
  Pair,
  RequestTypes,
} from '../../../models';
import {
  convertQueryParamsToUrl,
  executePreRequestScript,
  replaceVariables,
} from '../../../utils/helpers';
import { ApiDocumentationModal, CurlCommandModal } from '../../Modals';
import { safeJSONParse } from '../../../utils/helpers';
import { useLocalStorage } from '../../../hooks';
import { updateLatestRequestData } from '../../../slices/latestRequestDataSlice';
import { AxiosError } from 'axios';

/**
 *  Request Component
 */
const Request = () => {
  const [response, setResponse] = useState<Partial<ApiSample> | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('{}');
  const [isApiDocumentationModalOpen, setIsApiDocumentationModalOpen] =
    useState(false);
  const [isCurlCommandModalOpen, setIsCurlCommandModalOpen] = useState(false);
  const [apiDocumentation, setApiDocumentation] = useState<ApiDocumentation>();
  const { getItem } = useLocalStorage();
  const latestData = useSelector((state: RootState) => state.latestRequestData);
  const selectedRequestObj = useSelector(
    (state: RootState) => state.selectedRequest.requestData
  );
  const baseUrl = useSelector((state: RootState) => state.baseUrl.selectedUrl);
  const dispatch = useDispatch();
  const apiSample = useSelector(
    (state: RootState) => state.selectedRequest.variants[0]
  );

  /**
   * Get Api Documentation Data
   */
  const handleApiInfoClick = () => {
    setApiDocumentation(
      safeJSONParse(getItem('apiDocumentation'), false).find(
        (doc: ApiDocumentation) =>
          doc.compositeKeyId === selectedRequestObj.apiCompositeKeyId
      )
    );
    setIsApiDocumentationModalOpen(true);
  };

  /**
   *
   */
  const handleSendToMirror = async (toOurBackend: boolean) => {
    setResponse(null);
    setLoading(true);
    let responseState: Partial<ApiSample> = {},
      responsePayloadState = '{}';
    try {
      const parsedUrl = new URL(replaceVariables(selectedRequestObj.url));
      const parsedBaseUrl = baseUrl ? new URL(baseUrl) : null;
      const reqObj: Partial<ApiSampleNode> = {
        ...selectedRequestObj,
        scheme: (parsedBaseUrl ? parsedBaseUrl : parsedUrl).protocol.replace(
          ':',
          ''
        ),
        hostName: (parsedBaseUrl ? parsedBaseUrl : parsedUrl).hostname,
        port: +(parsedBaseUrl ? parsedBaseUrl : parsedUrl).port,
        rawUri: parsedUrl.pathname,
        parameters: Object.assign(
          {},
          ...Object.entries(selectedRequestObj.queryParams).map(
            ([key, values]) => ({
              [key]: values.map((value) => replaceVariables(value)),
            })
          )
        ),
        requestPayload: replaceVariables(selectedRequestObj.doc),
        requestHeaders: Object.assign(
          {},
          ...Object.entries(selectedRequestObj.headers).map(([key, value]) => ({
            [key]: replaceVariables(value),
          }))
        ),
      };
      const scriptExecuted = await executePreRequestScript(reqObj as any);
      const response = await sendMirrorRequest(
        scriptExecuted,
        toOurBackend
          ? undefined
          : `${(parsedBaseUrl || parsedUrl).href}${convertQueryParamsToUrl(
              selectedRequestObj.queryParams
            )}`,
        toOurBackend
      );
      const { data } = response;
      console.log('response: ', response);
      if (toOurBackend) {
        responseState = data;
        responsePayloadState = data.responsePayload || '{}';
      } else {
        responseState = {
          statusCode: response.status,
          responseHeaders: response.headers as Pair<string>,
          responsePayload: JSON.stringify(response.data) || '{}',
        };
        responsePayloadState = JSON.stringify(data) || '{}';
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Handle errors returned from the server
        const { message, response } = error;
        responseState = {
          statusCode: response.status,
          responsePayload: response.data,
          responseHeaders: response.headers as Pair<string>,
          uncaughtExceptionMessage: message,
        };
      } else if (error instanceof AxiosError && error.request) {
        // The request was made but no response was received
        const { message } = error;
        responseState = {
          statusCode: 500,
          responsePayload:
            'No response was received, check your network connection.',
          uncaughtExceptionMessage: message,
        };
        console.error(`No response was received: ${error.message}`);
      } else if (error instanceof Error) {
        // Something happened in setting up the request that triggered an Error
        const { message } = error;
        responseState = {
          statusCode: 500,
          responsePayload:
            "Couldn't execute your request, confirm if your service is up.",
          uncaughtExceptionMessage: message,
        };
        console.error(`Couldn't execute your request: ${error.message}`);
      }
    }
    setResponse(responseState);
    setData(responsePayloadState);
    setLoading(false);
  };

  /**
   *
   */
  const handleRequestStateChange = (request: Partial<ApiFlowRequest>) => {
    if (request.url) setResponse(null);
    dispatch(setSelectedRequest(request));
    if (request.doc || request.headers || request.queryParams) {
      const apiSample = latestData[selectedRequestObj.apiCompositeKeyId];
      apiSample &&
        dispatch(
          updateLatestRequestData({
            ...apiSample,
            ...(request.doc && { requestPayload: request.doc }),
            ...(request.headers && { requestHeaders: request.headers }),
            ...(request.queryParams && { parameters: request.queryParams }),
            apiCompositeKeyId: selectedRequestObj.apiCompositeKeyId,
          })
        );
    }
  };

  return (
    <div>
      <div className="mx-auto w-full">
        <div className="searchInputWrapper2">
          <i className="searchInputIcon2 fa fa-search"></i>
          <input
            className="searchInput2"
            type="text"
            placeholder="Search Samples"
          />
        </div>

        <div className="flex gap-[10px]">
          <VariantsPanel setRequest={handleRequestStateChange} />
          <div className="flex-1" style={{ maxWidth: 'calc(100% - 260px)' }}>
            <UrlEditor
              url={selectedRequestObj.url}
              reqMethod={selectedRequestObj.method}
              setReqMethod={(method: RequestTypes) =>
                handleRequestStateChange({ method })
              }
              onInputSend={handleSendToMirror}
            />
            <div className="block gap-[10px]">
              <RequestTabGroup
                queryParams={selectedRequestObj.queryParams}
                setQueryParams={(queryParams) =>
                  handleRequestStateChange({ queryParams })
                }
                headers={selectedRequestObj.headers}
                setHeaders={(headers) => handleRequestStateChange({ headers })}
                tests={selectedRequestObj.javaScripts?.tests || ''}
                script={selectedRequestObj.javaScripts?.preRequestScript || ''}
                sessionPRS={selectedRequestObj.javaScripts?.sessionPRS || ''}
                sessionTests={
                  selectedRequestObj.javaScripts?.sessionTests || ''
                }
                setTestsScript={(tests: string) =>
                  handleRequestStateChange({
                    javaScripts: {
                      tests,
                      preRequestScript:
                        selectedRequestObj.javaScripts?.preRequestScript || '',
                      sessionPRS:
                        selectedRequestObj.javaScripts?.sessionPRS || '',
                      sessionTests:
                        selectedRequestObj.javaScripts?.sessionTests || '',
                    },
                  })
                }
                setPreRequestScript={(preRequestScript: string) =>
                  handleRequestStateChange({
                    javaScripts: {
                      preRequestScript,
                      tests: selectedRequestObj.javaScripts?.tests || '',
                      sessionPRS:
                        selectedRequestObj.javaScripts?.sessionPRS || '',
                      sessionTests:
                        selectedRequestObj.javaScripts?.sessionTests || '',
                    },
                  })
                }
                setSessionPRS={(sessionPRS: string) =>
                  handleRequestStateChange({
                    javaScripts: {
                      sessionPRS,
                      tests: selectedRequestObj.javaScripts?.tests || '',
                      preRequestScript:
                        selectedRequestObj.javaScripts?.preRequestScript || '',
                      sessionTests:
                        selectedRequestObj.javaScripts?.sessionTests || '',
                    },
                  })
                }
                setSessionTests={(sessionTests: string) =>
                  handleRequestStateChange({
                    javaScripts: {
                      sessionTests,
                      tests: selectedRequestObj.javaScripts?.tests || '',
                      preRequestScript:
                        selectedRequestObj.javaScripts?.preRequestScript || '',
                      sessionPRS:
                        selectedRequestObj.javaScripts?.sessionPRS || '',
                    },
                  })
                }
                doc={selectedRequestObj.doc}
                setDoc={(doc) => handleRequestStateChange({ doc })}
              />

              <Response response={response} data={data} loading={loading} />
            </div>
          </div>

          <ul className="right-pane">
            <li>
              <i className="fa fa-file-text-o" aria-hidden="true"></i>
            </li>
            <li>
              <i className="fa fa-comment-o" aria-hidden="true"></i>
            </li>
            <li onClick={() => apiSample && setIsCurlCommandModalOpen(true)}>
              <i className="fa fa-code" aria-hidden="true"></i>
            </li>
            <li>
              <i
                style={{ fontSize: 22 }}
                className="fa fa-lightbulb-o"
                aria-hidden="true"
              ></i>
            </li>
            <li onClick={handleApiInfoClick}>
              <i
                style={{ fontSize: 20 }}
                className="fa fa-info-circle"
                aria-hidden="true"
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <ApiDocumentationModal
        apiDocumentation={apiDocumentation}
        isOpen={isApiDocumentationModalOpen}
        setIsOpen={(isOpen) => setIsApiDocumentationModalOpen(isOpen)}
      />
      <CurlCommandModal
        apiSample={apiSample}
        isOpen={isCurlCommandModalOpen}
        setIsOpen={(isOpen) => setIsCurlCommandModalOpen(isOpen)}
      />
    </div>
  );
};

export default Request;
