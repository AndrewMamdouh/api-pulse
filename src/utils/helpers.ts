import {
  ApiChainRequestType,
  ApiResponseDiffChain,
  CollectionsResponse,
} from '../models/requestModels';
import {
  ApiSample,
  ApiSampleNode,
  Collection,
  Flow,
  Pair,
  VariableLocation,
} from '../models/index';
import {
  ComparisonReportForFlow,
  Difference,
  RequestData,
} from '../models/reportModel';
import jp from 'jsonpath';
import { EnvState, setEnvState } from '../slices/envSlice';
import { store } from '../store';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert getTrafficDetails2 Response To Collections
 */
const convertTrafficDataToCollections = (
  data: CollectionsResponse
): Collection[] => {
  const teams = Array.from(new Set(data.map(({ apiOwner }) => apiOwner.team)));
  return teams.map((team) => {
    const envs = new Set<string>();
    data.forEach(({ apiOwner }) =>
      apiOwner.team === team ? envs.add(apiOwner.env) : null
    );
    return {
      team,
      env: Array.from(envs).map((env) => {
        const serviceNames = new Set<string>();
        data.forEach(({ apiOwner }) =>
          apiOwner.team === team && apiOwner.env === env
            ? serviceNames.add(apiOwner.serviceName)
            : null
        );
        return {
          path: env,
          application: Array.from(serviceNames).map((serviceName) => {
            const matchedCol = data.find(
              ({ apiOwner }) =>
                apiOwner.team === team &&
                apiOwner.env === env &&
                apiOwner.serviceName === serviceName
            );
            const uriPaths = new Set<string>();
            matchedCol?.apiCompositeKeyStatusSamples.forEach(({ samples }) =>
              samples.forEach(({ uri }) => uriPaths.add(uri.uriPath))
            );
            return {
              title: serviceName,
              URIs: Array.from(uriPaths).map((uriPath) => {
                const matchedByUriPathApiSamples =
                  matchedCol?.apiCompositeKeyStatusSamples.filter(
                    (statusSample) =>
                      statusSample.samples[0].uri.uriPath === uriPath
                  );
                const methods = new Set<string>();
                matchedByUriPathApiSamples?.forEach(({ samples }) =>
                  methods.add(samples[0].method)
                );
                return {
                  uriPath,
                  statuses: Array.from(methods).map((method) => {
                    const matchedByMethodApiSamples =
                      matchedByUriPathApiSamples?.filter(
                        ({ samples }) => samples[0].method === method
                      );
                    const statuses = new Set<number>();
                    matchedByMethodApiSamples?.forEach(({ status }) =>
                      statuses.add(status)
                    );
                    return {
                      method,
                      apiStatuses: Array.from(statuses).map((statusCode) => {
                        const matchedByStatusApiSample =
                          matchedByMethodApiSamples?.find(
                            ({ status }) => status === statusCode
                          );
                        return {
                          statusCode,
                          requestData:
                            matchedByStatusApiSample?.samples.reverse() || [],
                        };
                      }),
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };
  });
};

/**
 * Generate Latest apiSamples
 */
const generateLatestApiSamples = (
  data: CollectionsResponse
): { [key: string]: ApiSample } =>
  data
    .map(({ apiCompositeKeyStatusSamples }) =>
      apiCompositeKeyStatusSamples.map(
        ({ samples }) => [...samples].reverse()[0]
      )
    )
    .flat(2)
    .reduce(
      (acc, { apiCompositeKeyId, ...rest }) =>
        apiCompositeKeyId ? { ...acc, [apiCompositeKeyId]: rest } : acc,
      {}
    );
/**
 * Get Array Unique Values  (No Duplicates)
 */
const getArrayUniqueValue = (arr: string[]) =>
  arr.filter((val, idx) => arr.indexOf(val) === idx);

/**
 *
 */
const getSubListStyle = (isAppMenuOpen: boolean) => {
  return {
    maxHeight: isAppMenuOpen ? '1000px' : '0px',
    transition: 'max-height 0.3 ease-in-out',
    overflow: 'scroll',
  };
};

/**
 *
 */
const abstractRawUri = (rawUri: string, uriPath?: string): string => {
  if (!uriPath) return rawUri;

  let abstractedUri = rawUri;
  const pathSegments = uriPath.split('/');
  const rawUriSegments = rawUri.split('/');

  if (pathSegments.length !== rawUriSegments.length) {
    console.warn(
      'rawUri does not match the expected uriPath structure:',
      rawUri,
      uriPath
    );
    return rawUri; // Return the original rawUri if they don't match in structure.
  }

  for (let i = 0; i < pathSegments.length; i++) {
    if (pathSegments[i].startsWith('{') && pathSegments[i].endsWith('}')) {
      rawUriSegments[i] = pathSegments[i];
    }
  }

  abstractedUri = rawUriSegments.join('/');

  return abstractedUri;
};

/**
 *
 */
const getUniqueRawUris = (data: ApiSample[]): ApiSample[] => {
  const uniqueItemsMap: { [key: string]: any } = {};

  try {
    data.forEach((item) => {
      const rawUri = item.rawUri;
      if (!rawUri) {
        console.warn('Skipping item due to missing rawUri:', item);
        return;
      }

      // Abstract the rawUri
      let abstractedUri = abstractRawUri(rawUri, item.uri?.uriPath);

      abstractedUri += convertQueryParamsToUrl(item.parameters);

      // Store the item in the map using the abstracted identifier
      uniqueItemsMap[abstractedUri] = item;
    });
    console.log('uniqueItemsMap: ', uniqueItemsMap);
    //return uniqueItemsMap;
    return Object.values(uniqueItemsMap);
    //return Object.keys(uniqueItemsMap);
  } catch (error) {
    console.error('An error occurred while processing the data:', error);
    return [];
  }
};

/**
 *
 */
export function topologicalSort(nodes: any, edges: any) {
  const result: any = [];
  const visited: any = {};
  const graph: any = {};

  // Initialize the graph
  nodes.forEach((node: any) => {
    graph[node.nodeId] = [];
  });

  // Fill the graph with edges
  edges.forEach((edge: any) => {
    if (graph[edge.sourceNodeId]) {
      graph[edge.sourceNodeId].push(edge.targetNodeId);
    }
  });

  /**
   *
   */
  function visit(node: any) {
    if (!visited[node.nodeId]) {
      visited[node.nodeId] = true;
      if (graph[node.nodeId]) {
        graph[node.nodeId].forEach((targetNodeId: any) => {
          visit(nodes.find((n: any) => n.nodeId === targetNodeId));
        });
      }
      result.push(node);
    }
  }

  nodes.forEach((node: any) => {
    if (!visited[node.nodeId]) {
      visit(node);
    }
  });

  return result;
}

/**
 *
 */
const requiredMessage = (fieldName: string) => `${fieldName} is required`;

/**
 *  Normalize Date Format
 */
const formatDate = (inputDate: string) => {
  if (!inputDate) return inputDate;
  const dateObj = new Date(inputDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDate;
};

/**
 * Convert Flows To React Flow State (Can be used in restore flows)
 */
const convertFlowToReactFlowState = (flow: Flow) => {
  const nodes: any[] = [];
  let sortedNodes = [];

  if (flow?.apiSampleNodes?.length && flow?.apiSampleConvertorNodes?.length) {
    sortedNodes = topologicalSort(
      flow?.apiSampleNodes,
      flow?.apiSampleConvertorNodes
    );
  }
  sortedNodes = sortedNodes?.slice().reverse();
  if (flow && Object.keys(flow).length !== 0 && sortedNodes) {
    let yPos = 60;
    sortedNodes?.length > 0 &&
      sortedNodes?.forEach((data: any) => {
        const newNode = {
          id: data.nodeId,
          type: 'requestNode',
          position: {
            x: 300,
            y: yPos,
            zoom: 1,
          },
          data: { ...data, label: data.rawUri },
        };
        nodes.push(newNode);
        yPos += 100;
      });
  }
  const edges = flow?.apiSampleConvertorNodes?.map((edge) => ({
    id: edge.nodeId,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    type: 'mapperEdge',
    data: edge,
  }));

  return {
    nodes,
    edges,
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  };
};

/**
 *  Replaces Variables With Values
 */
const replaceVariables = (text: string) => {
  const exposedVars = getExposedVariables();
  const regex = /\{\{([^}]+)\}\}/g;
  return text.replace(regex, (match, variableName) => {
    const envVar = exposedVars.find(({ name }) => name === variableName);
    if (envVar) {
      return envVar.current;
    } else {
      throw new Error(`Unresolved variable: ${match}`);
    }
  });
};

/**
 * Converts camelCase strings into Spaced Uppercase ones
 * From "helloWorld" To "Hello World"
 */
const convertCamelCaseToSpacedUppercase = (str: string) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

/**
 * Generate curl request command
 */
const generateCurlCommand = (apiSample: ApiSample, beautify = false) => {
  const separator = beautify ? '\n' : ' ';
  let curlCommand = `curl -X ${apiSample.method.toUpperCase()}`;

  // Add headers
  if (apiSample.requestHeaders) {
    Object.entries(apiSample.requestHeaders).forEach(([key, value]) => {
      curlCommand += `${separator}-H '${key}: ${value}'`;
    });
  }

  // Add payload
  if (apiSample.requestPayload) {
    curlCommand += `${separator}-d '${apiSample.requestPayload}'`;
  }

  // Construct URL with query parameters
  let fullUrl = `${apiSample.scheme}://${apiSample.hostName}:${apiSample.port}${apiSample.rawUri}`;

  const parameters = Object.keys(apiSample.parameters)
    .map((param) =>
      apiSample.parameters[param].map((value) => `${param}=${value}`).join('&')
    )
    .join('&');

  if (parameters) fullUrl += `?${parameters}`;

  curlCommand += `${separator}${fullUrl}`;

  return curlCommand;
};

export type SimpleDiffNodeData = {
  rawUri: string;
  flowName: string;
  nodeId: string;
  valueKey: string;
  valueExp: string;
  valueCur: string;
  comparisonType: string;
  location: string;
  className?: string;
};

export type SimpleSummary = SimpleDiffNodeData[];

/**
 * Generate Simple Summary (For Simple Report Table)
 */
const generateSimpleSummary = (
  flowComparisonList: ComparisonReportForFlow[]
) => {
  const summary: SimpleSummary = [];

  flowComparisonList?.forEach((flow) => {
    flow.nodeComparison.forEach((node) => {
      const differences = [
        ...node.dataTypeDifferences,
        ...node.valueDifferences,
        ...node.missingKeys,
        ...node.uriDifferences,
        ...node.extraKeys,
      ];

      differences.forEach((difference) => {
        summary.push({
          flowName: flow.flowName,
          nodeId: node.nodeId,
          rawUri: node.uri,
          location: difference.location,
          valueKey: difference.key,
          valueExp: difference.expected || '',
          valueCur: difference.current || '',
          comparisonType: difference.comparisonType,
          className: 'cursor-pointer',
        });
      });
    });
  });

  return summary;
};

export type DetailedDiffNodeData = {
  valueDifferences: Difference[];
  dataTypeDifferences: Difference[];
  uriDifferences: Difference[];
  missingKeys: Difference[];
  extraKeys: Difference[];
};

export type DetailedSummary = {
  [rawUri: string]: {
    [flowName: string]: {
      [nodeId: string]: DetailedDiffNodeData;
    };
  };
};

/**
 * Generate Detailed Summary (For Detailed Report Table)
 */
const generateDetailedSummary = (
  flowComparisonList: ComparisonReportForFlow[]
) => {
  const apiSummary: DetailedSummary = {};

  flowComparisonList?.forEach((flow) => {
    flow.nodeComparison.forEach((node) => {
      if (
        flow.haveDiff &&
        node.haveDiff &&
        (node.dataTypeDifferences.length ||
          node.extraKeys.length ||
          node.missingKeys.length ||
          node.uriDifferences.length ||
          node.valueDifferences.length)
      ) {
        if (!apiSummary[node.uri]) apiSummary[node.uri] = {};
        if (!apiSummary[node.uri][flow.flowName])
          apiSummary[node.uri][flow.flowName] = {};
        apiSummary[node.uri][flow.flowName][node.nodeId] = {
          dataTypeDifferences: [...node.dataTypeDifferences],
          valueDifferences: [...node.valueDifferences],
          missingKeys: [...node.missingKeys],
          uriDifferences: [...node.uriDifferences],
          extraKeys: [...node.extraKeys],
        };
      }
    });
  });

  return apiSummary;
};

/**
 * Generate IgnoredDiff Summary (For IgnoredDiff Report Table)
 */
const generateIgnoredDiffSummary = (
  flowComparisonList: ComparisonReportForFlow[]
) => {
  const apiSummary: DetailedSummary = {};

  flowComparisonList?.forEach((flow) => {
    flow.nodeComparison.forEach((node) => {
      if (flow.haveDiff && node.ignoredDiff) {
        if (!apiSummary[node.uri]) apiSummary[node.uri] = {};
        if (!apiSummary[node.uri][flow.flowName])
          apiSummary[node.uri][flow.flowName] = {};
        apiSummary[node.uri][flow.flowName][node.nodeId] = {
          dataTypeDifferences: [...node.ignoredDiff.dataTypeDifferences],
          valueDifferences: [...node.ignoredDiff.valueDifferences],
          missingKeys: [...node.ignoredDiff.missingKeys],
          uriDifferences: [...node.ignoredDiff.uriDifferences],
          extraKeys: [...node.ignoredDiff.extraKeys],
        };
      }
    });
  });

  return apiSummary;
};

export type DiffSample = {
  currentSample: ApiSampleNode | null;
  expectedSample: ApiSampleNode | null;
};

export type DiffChainsToSamples = {
  [key: string]: DiffSample;
};

/**
 * Map DiffChains To SampleNodes
 */
const mapDiffChainsToSamples = (
  apiResponseDiffChains: ApiResponseDiffChain[]
) => {
  const nodeToSampleMap: DiffChainsToSamples = {};

  apiResponseDiffChains.forEach((apiResponseDiff) => {
    const { expectedApiResponseChain, currentApiResponseChain } =
      apiResponseDiff;

    // Assuming the chain contains an array of ApiSampleNode which extends APISample
    expectedApiResponseChain.apiSampleNodes.forEach(
      (sampleNode: ApiSampleNode) => {
        if (!nodeToSampleMap[sampleNode.nodeId]) {
          nodeToSampleMap[sampleNode.nodeId] = {
            expectedSample: null,
            currentSample: null,
          };
        }
        nodeToSampleMap[sampleNode.nodeId].expectedSample = sampleNode;
      }
    );

    currentApiResponseChain.apiSampleNodes.forEach(
      (sampleNode: ApiSampleNode) => {
        if (!nodeToSampleMap[sampleNode.nodeId]) {
          nodeToSampleMap[sampleNode.nodeId] = {
            expectedSample: null,
            currentSample: null,
          };
        }
        nodeToSampleMap[sampleNode.nodeId].currentSample = sampleNode;
      }
    );
  });

  return nodeToSampleMap;
};

/**
 * Get Persisted Env State From Redux
 */
const getEnvs = (): EnvState => {
  const { _persist, ...rest } = store.getState().env;
  return structuredClone(rest);
};

/**
 * Get All Variables
 */
const getAllVariables = () => {
  const { global, local } = getEnvs();
  const localVars = local.map(({ variables }) => variables).flat();

  return [...global, ...localVars];
};

/**
 * Get All Exposed Variables
 */
const getExposedVariables = () => {
  const { global, local, selectedEnv } = getEnvs();
  const localVars =
    local.find(({ name }) => name === selectedEnv)?.variables || [];

  return [...localVars, ...global];
};

/**
 * Get Variable By Name
 */
const getVariable = (varName: string) => {
  const exposedVars = getExposedVariables();
  return exposedVars.find(({ name }) => name === varName)?.current;
};
/**
 * Edit Variable By Name
 */
const editVariable = (varName: string, newValue: string) => {
  const { global, local, selectedEnv } = getEnvs();
  const exposedVars = getExposedVariables();
  const matchedVar = exposedVars.find(({ name }) => name === varName);
  if (!matchedVar) throw new Error(`Invalid Variable: {{${varName}}}`);
  matchedVar.current = newValue;

  const existsInLocal = local
    .find(({ name }) => name === selectedEnv)
    ?.variables.find((localVar) => localVar.name === varName);

  const envState = existsInLocal
    ? {
        global,
        local: local.map((env) =>
          env.name === selectedEnv
            ? {
                ...env,
                variables: env.variables.map((localVar) =>
                  localVar.name === varName ? matchedVar : localVar
                ),
              }
            : env
        ),
        selectedEnv,
      }
    : {
        global: global.map((globalVar) =>
          globalVar.name === varName ? matchedVar : globalVar
        ),
        local,
        selectedEnv,
      };
  store.dispatch(setEnvState({ envState }));
};

/**
 *  Execute Pre Request Script
 */
const executePreRequestScript = async (sampleNode: ApiSampleNode) => {
  if (!sampleNode.javaScripts?.preRequestScript) return sampleNode;
  try {
    let updatedNode = structuredClone(sampleNode);
    // Create a sandboxed environment object for pm
    const pmEnvironment = {
      /**
       *  Get Request Key
       */
      getRequestKey: (key: string) => {
        if (sampleNode.hasOwnProperty(key)) {
          return sampleNode[key as keyof ApiSampleNode];
        } else if (
          sampleNode.requestPayload &&
          JSON.parse(sampleNode.requestPayload)[key]
        ) {
          return JSON.parse(sampleNode.requestPayload)[key];
        }

        return null;
      },
      /**
       *  Update Request Key
       */
      updatedRequestKey: (key: string, value: string) => {
        if (sampleNode.hasOwnProperty(key)) {
          (updatedNode as any)[key] = value;

          return updatedNode;
        } else if (
          sampleNode.requestPayload &&
          JSON.parse(sampleNode.requestPayload)[key]
        ) {
          const requestPayload = JSON.parse(updatedNode.requestPayload);
          requestPayload[key] = value;
          updatedNode = {
            ...updatedNode,
            requestPayload: JSON.stringify(requestPayload),
          };

          return updatedNode;
        }

        console.error(`${key} not found in request`);
        return null;
      },
      /**
       *  Get Request
       */
      getRequest: () => sampleNode,
      /**
       *  Get Request Headers
       */
      getHeaders: () => sampleNode.requestHeaders || null,
      /**
       *  Update Request Header
       */
      updateHeader: (key: string, value: string) => {
        if (sampleNode.requestHeaders) {
          const requestHeaders = { ...sampleNode.requestHeaders } as Pair;

          if (requestHeaders[key]) {
            requestHeaders[key] = value;
            updatedNode = { ...sampleNode, requestHeaders };
            return updatedNode;
          }
          console.log(`${key} header not found.`);
        }

        return updatedNode;
      },
      /**
       *  Add Request Header
       */
      addHeader: (key: string, value: string) => {
        if (sampleNode.requestHeaders) {
          const requestHeaders = { ...sampleNode.requestHeaders } as Pair;
          requestHeaders[key] = value;
          updatedNode = { ...sampleNode, requestHeaders };
        }
        return updatedNode;
      },
      /**
       *  Get Parameters
       */
      getParams: () => sampleNode.parameters || null,
      /**
       *  Update Parameter
       */
      updateParam: (key: string, value: string) => {
        if (sampleNode.parameters) {
          const parameters = { ...sampleNode.parameters } as Pair<string[]>;

          if (parameters[key]) {
            parameters[key] = [value];
            updatedNode = { ...sampleNode, parameters };

            return updatedNode;
          }
          console.log(`${key} parameter not found.`);
        }

        return updatedNode;
      },
      /**
       *  Add Parameter
       */
      addParam: (key: string, value: string) => {
        if (sampleNode.parameters) {
          const parameters = { ...sampleNode.parameters } as Pair<string[]>;

          if (parameters[key]) parameters[key] = [...parameters[key], value];
          else parameters[key] = [value];

          updatedNode = { ...sampleNode, parameters };
        }

        return updatedNode;
      },
      /**
       *  Get Env Variable
       */
      getEnv: (varName: string) => getVariable(varName),
      /**
       *  Update Env Variable
       */
      updateEnv: (varName: string, varValue: string) =>
        editVariable(varName, varValue),
    };

    const AsyncFunction = Object.getPrototypeOf(
      async function () {}
    ).constructor;
    const scriptFn = new AsyncFunction(
      'pm',
      'console',
      sampleNode.javaScripts.preRequestScript
    );
    await scriptFn(pmEnvironment, console);
    return updatedNode;
  } catch (error) {
    // Handle script execution errors
    console.error('Error executing pre-request script:', error);
    return sampleNode;
  }
};

/**
 *  Generate Flow Payload
 */
const generateFlowPayload = async (newFlow: Flow, replaceVars = true) => {
  let apiSampleNodes: ApiSampleNode[] = await resolvePromisesSequentially(
    [...newFlow.apiSampleNodes],
    executePreRequestScript
  );

  if (replaceVars) {
    apiSampleNodes = apiSampleNodes.map(
      ({
        parameters,
        requestHeaders,
        requestPayload,
        ...rest
      }: ApiSampleNode) => ({
        ...rest,
        parameters: Object.assign(
          {},
          ...Object.entries(parameters).map(([key, values]) => ({
            [key]: values.map((value) => replaceVariables(value)),
          }))
        ),
        requestPayload: replaceVariables(requestPayload),
        requestHeaders: Object.assign(
          {},
          ...Object.entries(requestHeaders).map(([key, value]) => ({
            [key]: replaceVariables(value),
          }))
        ),
      })
    );
  }

  return {
    ...newFlow,
    apiSampleNodes,
  };
};
/**
 * Query & Update Object With Key Path
 */
const setObjectByKeyPath = (
  obj: Record<string, any>,
  keys: (string | number)[],
  value: any
) => {
  const updatedObj = obj;

  let currentLevel = updatedObj;

  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      currentLevel[key] = value;
    } else {
      currentLevel = currentLevel[key];
    }
  });

  return updatedObj;
};

/**
 * Merge Latest RequestData With Flows
 */
const mergeLatestRequestDataWithFlows = (
  requestData: RequestData,
  flows: Flow[]
) => {
  const exposedVars = getExposedVariables();
  const exposedVarNames = exposedVars.map(({ name }) => name);
  const idxReg = new RegExp(/^\d+$/);
  const mergedFlows = structuredClone(flows);
  flows.forEach(
    ({ apiChainRequestType, apiSampleNodes }, flowIdx) =>
      apiChainRequestType === ApiChainRequestType.LATEST &&
      apiSampleNodes.forEach(
        ({ apiCompositeKeyId, envVarPaths, ...rest }, nodeIdx) => {
          if (apiCompositeKeyId && requestData[apiCompositeKeyId]) {
            let mergedParams = structuredClone(
              requestData[apiCompositeKeyId].parameters
            );
            let mergedPayload = safeJSONParse(
              requestData[apiCompositeKeyId].requestPayload
            );
            let mergedHeaders = structuredClone(
              requestData[apiCompositeKeyId].requestHeaders
            );

            envVarPaths
              ?.filter(({ varKey }) =>
                exposedVarNames.includes(varKey.slice(2, -2))
              )
              .forEach(({ varKey, varLocation, varPath }) => {
                const queryPath = varPath
                  .split('.')
                  .map((key) => (idxReg.test(key) ? `[${key}]` : `.${key}`))
                  .join('');
                let scope;
                switch (varLocation) {
                  case VariableLocation.HEADER_KEY:
                    scope = mergedHeaders;
                    break;
                  case VariableLocation.QUERY_PARAMETER:
                    scope = mergedParams;
                    break;
                  default:
                    scope = mergedPayload;
                }
                const matchedNodes = jp.nodes(scope, `$${queryPath}`);
                if (matchedNodes.length) {
                  const varPath = matchedNodes[0].path.slice(1);
                  setObjectByKeyPath(
                    scope,
                    varPath,
                    exposedVars.find(({ name }) => varKey.slice(2, -2) === name)
                      ?.current
                  );
                }
              });

            mergedFlows[flowIdx].apiSampleNodes[nodeIdx] = {
              apiCompositeKeyId,
              envVarPaths,
              ...rest,
              parameters: mergedParams,
              requestPayload: JSON.stringify(mergedPayload),
              requestHeaders: mergedHeaders,
            };
          }
        }
      )
  );
  return mergedFlows;
};

/**
 * Convert Query Parameters To URL
 */
const convertQueryParamsToUrl = (queryParams: Pair<string[]>) => {
  const params = Object.keys(queryParams).sort();
  if (!params.length) return '';
  let queryParamsUrl = '?';
  params.forEach((param, paramIdx) => {
    queryParams[param].forEach((value, valueIdx, values) => {
      queryParamsUrl += `${param}=${value}`;
      if (paramIdx !== params.length - 1 || valueIdx !== values.length - 1)
        queryParamsUrl += '&';
    });
  });
  return queryParamsUrl;
};

/**
 *  Safely Parse JSON
 */
const safeJSONParse = (
  jsonString: any,
  isObject = true,
  handleError?: (e: any) => void,
  fallback?: any
) => {
  try {
    const parsedJson = JSON.parse(jsonString);
    return parsedJson ? parsedJson : isObject ? {} : [];
  } catch (e) {
    console.error(e);
    handleError && handleError(e);
    return fallback ? fallback : isObject ? {} : [];
  }
};
/**
 * Get All JSON Nodes
 */
const getJsonLeafNodes = (obj: Record<any, any>, currentPath: string = '') => {
  const leafNodes: { path: string; value: any }[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newPath = currentPath === '' ? key : `${currentPath}.${key}`;

      if (typeof obj[key] === 'object') {
        const nestedNodes = getJsonLeafNodes(obj[key], newPath);
        leafNodes.push(...nestedNodes);
      } else {
        leafNodes.push({ path: newPath, value: obj[key] });
      }
    }
  }
  return leafNodes;
};

/**
 * Run multiple promises in sequence and return the results as array.
 * Similar to Promise.all(), but instead of running in parallel
 * it runs in sequence.
 */
async function resolvePromisesSequentially<ElementType, PromisedReturnType>(
  items: ElementType[],
  /**
   * Function Returning a Promise
   */
  functor: (item: ElementType) => Promise<PromisedReturnType>
): Promise<PromisedReturnType[]> {
  return items.reduce(
    (promiseChain, item) =>
      promiseChain.then((resultsSoFar) =>
        functor(item).then((currentResult) => [...resultsSoFar, currentResult])
      ),
    Promise.resolve<PromisedReturnType[]>([])
  );
}

/**
 * Convert Api Sample To Api Sample Node
 */
const convertApiSampleToApiSampleNode = (apiSample: ApiSample) => {
  return {
    ...apiSample,
    nodeId: uuidv4(),
    comparisonConfigs: [],
    javaScripts: {
      preRequestScript: '',
      tests: '',
      sessionPRS: '',
      sessionTests: '',
    },
    envVarPaths: null,
  } as ApiSampleNode;
};

export {
  requiredMessage,
  getSubListStyle,
  getUniqueRawUris,
  getArrayUniqueValue,
  formatDate,
  convertFlowToReactFlowState,
  replaceVariables,
  convertCamelCaseToSpacedUppercase,
  convertQueryParamsToUrl,
  generateCurlCommand,
  generateSimpleSummary,
  generateDetailedSummary,
  mapDiffChainsToSamples,
  executePreRequestScript,
  generateFlowPayload,
  generateIgnoredDiffSummary,
  mergeLatestRequestDataWithFlows,
  convertTrafficDataToCollections,
  generateLatestApiSamples,
  safeJSONParse,
  getJsonLeafNodes,
  getAllVariables,
  getEnvs,
  getExposedVariables,
  getVariable,
  editVariable,
  resolvePromisesSequentially,
  convertApiSampleToApiSampleNode,
};
