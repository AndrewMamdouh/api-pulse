import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { updateApiSampleConvertorForNewFlow } from '../../../../slices/flowSlice';
import { ApiSampleMappingNode } from '../../../../models';
import { KeyValuePair } from '../../../../models/reportModel';
import KeyValuePairPane from '../../../Panes/KeyValue/KeyValuePairPane';

type RequestMapperProps = {
  edgeId: string | undefined;
  //flowId: number;
  isEditable?: boolean;
};

/**
 *  RequestMapper Modal Component
 */
const RequestMapper = ({
  // flowId,
  edgeId,
  isEditable = true,
}: RequestMapperProps) => {
  const dispatch = useDispatch();
  const newFlowConverters = useSelector(
    (state: RootState) => state.flow.newFlow.apiSampleConvertorNodes
  );
  const selectedFlowConverters = useSelector(
    (state: RootState) => state.selectedFlow.apiSampleConvertorNodes
  );

  const converter = isEditable
    ? newFlowConverters.find((api) => api.nodeId === edgeId)
    : selectedFlowConverters.find((api) => api.nodeId === edgeId);

  if (!converter || !edgeId)
    return <div>No Api Sample Convertor Object found</div>;

  /**
   *  Update RequestMapper Modal State
   */
  const handleConvertorObjectUpdate = (
    updates: Partial<ApiSampleMappingNode>
  ) => {
    isEditable &&
      dispatch(updateApiSampleConvertorForNewFlow({ edgeId, updates }));
  };

  const requestTabs = [
    {
      slug: 'query-params',
      title: 'Params',
      panel: KeyValuePairPane,
      paneValue: converter.queryParamMapping,
      /**
       *  Update Parameters
       */
      setPaneValue: (queryParamMapping: KeyValuePair[]) =>
        handleConvertorObjectUpdate({ queryParamMapping }),
    },
    {
      slug: 'headers',
      title: 'Headers',
      panel: KeyValuePairPane,
      paneValue: converter.headerMapping,
      /**
       *  Update Headers
       */
      setPaneValue: (headerMapping: KeyValuePair[]) =>
        handleConvertorObjectUpdate({ headerMapping }),
    },
    {
      slug: 'body',
      title: 'Body',
      panel: KeyValuePairPane,
      paneValue: converter.requestBodyMapping,
      /**
       *  Update Body
       */
      setPaneValue: (requestBodyMapping: KeyValuePair[]) =>
        handleConvertorObjectUpdate({ requestBodyMapping }),
    },
  ];

  return (
    <div className="min-w-[460px]">
      <div className="flex justify-start items-center ">
        <span className="text-xl font-medium pt-3">Request</span>
      </div>
      <Tabs forceRenderTabPanel selectedTabClassName="border-b-2 text-blue-600">
        <TabList className="flex mt-5 border border-gray-300 rounded-t-lg">
          {requestTabs.map((tab) => (
            <Tab
              className="mr-3 py-2 px-4 border-blue-500 focus:outline-none 
                              hover:text-blue-500 cursor-pointer text-blue-500"
              key={tab.slug}
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>

        {requestTabs.map((tab) => (
          <TabPanel
            className="react-tabs__tab-panel px-4 py-4 rounded-b-lg border border-t-0 border-gray-300 min-h-[400px] "
            key={tab.slug}
          >
            <tab.panel
              paneValue={tab.paneValue}
              setPaneValue={tab.setPaneValue}
              isEditable={isEditable}
            />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default RequestMapper;
