/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useId, useState } from 'react';
import { ApplicationIcon, EnvIcon, FolderIcon } from '../../../fa-icons';
import {
  convertFlowToReactFlowState,
  getSubListStyle,
  getUniqueRawUris,
} from '../../../utils/helpers';
import { useDispatch } from 'react-redux';
import ToggleArrow from './arrow';
import Title from './Title';
import {
  resetRequest,
  setStatuses,
  setVariants,
} from '../../../slices/selectedRequestSlice';
import { Draggable } from '../../dnd';
import { ApiSample, Flow, Pair, RequestTypes } from '../../../models';
import { setSelectedFlow } from '../../../slices/selectedFlowSlice';
import { DropDownMenu } from '../../UI';
import { setNewFlow } from '../../../slices/flowSlice';
import { useNavigate } from 'react-router';
import { removeWorkFlow } from '../../../api/deleteServices';
import { useLocalStorage } from '../../../hooks';
import { Tooltip } from 'react-tooltip';

interface MenuItemProps {
  team: string;
  env: EnvItemData[];
  /**
   * setUrl Function Type
   */
  setUrl: (url: string) => void;
  /**
   * setReqMethod Function Type
   */
  setReqMethod: (reqMethod: RequestTypes) => void;
  /**
   * setHeaders Function Type
   */
  setHeaders: (headers: Pair) => void;
  /**
   * setQueryParams Function Type
   */
  setQueryParams: (queryParams: Pair<string[]>) => void;
  /**
   * setDoc Function Type
   */
  setDoc: (doc: string) => void;
  /**
   * setApiCompositeKey Function Type
   */
  setApiCompositeKey: (key: string) => void;
  mock: boolean;
  flowName: string;
  flows: Flow[];
}

interface EnvItemData {
  path: string;
  application: AppItemData[];
}

interface AppItemData {
  title: string;
  URIs: URIItemData[];
}

interface URIItemData {
  uriPath: string;
  statuses: StatusItemData[];
}

interface StatusItemData {
  method: string;
  apiStatuses: ApiStatusData[];
}

export interface ApiStatusData {
  statusCode: number;
  requestData: ApiSample[];
}

interface EnvItemProps {
  singleEnv: EnvItemData;
  /**
   * setUrl Function Type
   */
  setUrl: (url: string) => void;
  /**
   * setReqMethod Function Type
   */
  setReqMethod: (reqMethod: RequestTypes) => void;
  /**
   * setHeaders Function Type
   */
  setHeaders: (headers: Pair) => void;
  /**
   * setQueryParams Function Type
   */
  setQueryParams: (queryParams: Pair<string[]>) => void;
  /**
   * setDoc Function Type
   */
  setDoc: (doc: string) => void;
  /**
   * setApiCompositeKey Function Type
   */
  setApiCompositeKey: (key: string) => void;
}

interface AppItemProps {
  singleApp: AppItemData;
  /**
   * setUrl Function Type
   */
  setUrl: (url: string) => void;
  /**
   * setReqMethod Function Type
   */
  setReqMethod: (reqMethod: RequestTypes) => void;
  /**
   * setHeaders Function Type
   */
  setHeaders: (headers: Pair) => void;
  /**
   * setQueryParams Function Type
   */
  setQueryParams: (queryParams: Pair<string[]>) => void;
  /**
   * setDoc Function Type
   */
  setDoc: (doc: string) => void;
  /**
   * setApiCompositeKey Function Type
   */
  setApiCompositeKey: (key: string) => void;
}

interface URIItemProps {
  singleUri: URIItemData;
  /**
   * setUrl Function Type
   */
  setUrl: (url: string) => void;
  /**
   * setReqMethod Function Type
   */
  setReqMethod: (reqMethod: RequestTypes) => void;
  /**
   * setHeaders Function Type
   */
  setHeaders: (headers: Pair) => void;
  /**
   * setQueryParams Function Type
   */
  setQueryParams: (queryParams: Pair<string[]>) => void;
  /**
   * setDoc Function Type
   */
  setDoc: (doc: string) => void;
  /**
   * setApiCompositeKey Function Type
   */
  setApiCompositeKey: (key: string) => void;
}

/**
 *  MenuItem Component
 */
const MenuItem: React.FC<MenuItemProps> = ({
  team,
  env,
  setUrl,
  setReqMethod,
  setHeaders,
  setQueryParams,
  setDoc,
  setApiCompositeKey,
  mock,
  flowName,
  flows = [],
}) => {
  const [isEnvMenuOpen, setIsEnvMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setItem } = useLocalStorage();

  const flow = flows.find((flow) => flow.flowName === flowName);

  /**
   *  Toggles Sub Menu Dropdown
   */
  const toggleSubMenu = () => setIsEnvMenuOpen(!isEnvMenuOpen);
  /**
   *  Click Handler For Saved Flows
   */
  function handleFlowClick() {
    flow && dispatch(setSelectedFlow(flow));
  }

  return (
    <li className={`menu-item sub-menu`}>
      {!mock ? (
        <>
          <a href="#" onClick={toggleSubMenu}>
            <ToggleArrow isSubMenuOpen={isEnvMenuOpen} />
            <FolderIcon />
            <Title text={team} extraClass={'level2'} />
          </a>
          <div className="sub-menu-list" style={getSubListStyle(isEnvMenuOpen)}>
            <ul>
              {env.map((singleEnv, index) => (
                <EnvItem
                  key={index}
                  setUrl={setUrl}
                  setReqMethod={setReqMethod}
                  setHeaders={setHeaders}
                  setQueryParams={setQueryParams}
                  setDoc={setDoc}
                  //setRequestObject={setRequestObject}
                  setApiCompositeKey={setApiCompositeKey}
                  singleEnv={singleEnv}
                />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <a
          href="#"
          className="flex items-center justify-between gap-8"
          onClick={handleFlowClick}
        >
          <Title text={flowName} extraClass={'level2'} />
          <DropDownMenu
            removeHandler={async () => {
              flow && (await removeWorkFlow(flow.id));
            }}
            editHandler={() => {
              flow && dispatch(setNewFlow(flow));
              flow &&
                setItem(
                  'newFlow',
                  JSON.stringify(convertFlowToReactFlowState(flow))
                );
              navigate('/flows');
            }}
          />
        </a>
      )}
    </li>
  );
};

/**
 *  EnvItem Component
 */
const EnvItem: React.FC<EnvItemProps> = ({
  singleEnv,
  setUrl,
  setReqMethod,
  setHeaders,
  setQueryParams,
  setDoc,
  setApiCompositeKey,
  //setRequestObject,
}) => {
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  /**
   *  Toggles App Menu
   */
  const toggleAppMenu = () => setIsAppMenuOpen(!isAppMenuOpen);

  return (
    <li className="menu-item">
      <a href="#" onClick={toggleAppMenu}>
        <ToggleArrow isSubMenuOpen={isAppMenuOpen} />
        <EnvIcon />
        <Title text={singleEnv.path} />
      </a>
      <div
        className="sub-menu-list level2"
        style={getSubListStyle(isAppMenuOpen)}
      >
        <ul>
          {singleEnv.application.map((app, index) => (
            <AppItem
              key={index}
              singleApp={app}
              setUrl={setUrl}
              setReqMethod={setReqMethod}
              setHeaders={setHeaders}
              setQueryParams={setQueryParams}
              setDoc={setDoc}
              // setRequestObject={setRequestObject}
              setApiCompositeKey={setApiCompositeKey}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

// Define and export EnvItemProps here, similar to MenuItemProps

/**
 *  AppItem Component
 */
const AppItem: React.FC<AppItemProps> = ({
  singleApp,
  setUrl,
  setReqMethod,
  setHeaders,
  setQueryParams,
  setDoc,
  setApiCompositeKey,
  //setRequestObject,
}) => {
  const [isURIsOpen, setIsURIsOpen] = useState(false);

  /**
   * Toggles Item URI
   */
  const toggleURIs = () => setIsURIsOpen(!isURIsOpen);

  return (
    <li className="menu-item">
      <a href="#" onClick={toggleURIs}>
        <ToggleArrow isSubMenuOpen={isURIsOpen} />
        <ApplicationIcon />
        <Title text={singleApp.title} />
      </a>
      <div className="sub-menu-list" style={getSubListStyle(isURIsOpen)}>
        <ul>
          {singleApp.URIs.map((uri, index) => (
            <URIItem
              key={index}
              singleUri={uri}
              setUrl={setUrl}
              setReqMethod={setReqMethod}
              setHeaders={setHeaders}
              setQueryParams={setQueryParams}
              setDoc={setDoc}
              setApiCompositeKey={setApiCompositeKey}
              // setRequestObject={setRequestObject}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

// Define and export AppItemProps here, similar to MenuItemProps

/**
 *  URIItem Component
 */
const URIItem: React.FC<URIItemProps> = ({
  singleUri,
  setUrl,
  setReqMethod,
  setHeaders,
  setQueryParams,
  setDoc,
  setApiCompositeKey,
  // setRequestObject,
}) => {
  const dispatch = useDispatch();
  const id = useId();

  /**
   *
   */
  const handlePopulate = (requestData: any) => {
    const {
      scheme,
      hostName,
      port,
      rawUri,
      method,
      requestHeaders,
      parameters,
      requestPayload,
      apiCompositeKeyId,
    } = requestData;

    setApiCompositeKey(apiCompositeKeyId);

    setDoc(requestPayload || '{}');

    setQueryParams(parameters || {});
    setHeaders(requestHeaders || {});

    const completeUrl = `${scheme}://${hostName}:${port}${rawUri}`;
    setUrl(completeUrl);
    setReqMethod(method);
  };
  /**
   *
   */
  const handleOnClick = (apiStatuses: any[]) => {
    dispatch(resetRequest());
    dispatch(setStatuses({ statuses: apiStatuses }));
    // Find the first object with statusCode 200, if it exists
    const successfulStatus = apiStatuses.find(
      (status) => status.statusCode >= 200 && status.statusCode < 300
    );

    const variants = getUniqueRawUris(
      successfulStatus
        ? successfulStatus.requestData
        : apiStatuses[0]?.requestData
    );

    dispatch(setVariants({ variants }));

    // Get the requestData[0] to pass to handlePopulate
    const requestDataToPass = successfulStatus
      ? successfulStatus.requestData[0]
      : apiStatuses[0]?.requestData[0];

    //if (requestDataToPass) {
    // Ensure that requestPayload is always a string
    //const requestPayload = requestDataToPass.requestPayload || '{}'; // Default to an empty string if it's null

    //const requestDataToSend = { ...requestDataToPass, requestPayload };
    // Call handlePopulate with the modified requestData
    handlePopulate(requestDataToPass);
    //  }
  };

  return (
    <li className="menu-item">
      {singleUri.statuses.map((status, statusIndex) => (
        <Draggable
          key={statusIndex}
          data={status.apiStatuses}
          draggableId={singleUri.uriPath}
          type="requestNode"
        >
          <a
            href="#"
            key={statusIndex}
            onClick={() => handleOnClick(status.apiStatuses)}
            data-tooltip-id={`${id}-${statusIndex}`}
            data-tooltip-content={singleUri.uriPath}
            data-tooltip-variant="info"
            data-tooltip-offset={0}
          >
            <span className={`method ${status.method.toLowerCase()}`}>
              {status.method}
            </span>
            <span
              className="sub-menu-title"
              style={{ textTransform: 'lowercase' }}
            >
              <Tooltip
                id={`${id}-${statusIndex}`}
                style={{ fontWeight: 600, position: 'fixed' }}
              />
              {singleUri.uriPath}
            </span>
          </a>
        </Draggable>
      ))}
    </li>
  );
};

// Define and export URIItemProps here, similar to MenuItemProps

export default MenuItem;
