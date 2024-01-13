import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import JsonEditorPane from '../Panes/Json/JsonEditorPane';
import ResponseHeaderPane from '../Panes/ResponseHeader/ResponseHeaderPane';
import { ApiSampleNode } from '../../models';

type ReportResponseTabGroupProps = {
  response: ApiSampleNode | null;
  activeTab: number;
  /**
   * onSelect Function Type
   */
  onSelect: (tabIdx: number) => void;
  highlightedDiffKey?: string;
  diffKeys?: string[];
  hasOriginalDoc?: boolean;
};

/**
 *  ResponseTabGroup Component
 */
const ReportResponseTabGroup = ({
  response,
  activeTab,
  onSelect,
  highlightedDiffKey,
  diffKeys,
  hasOriginalDoc,
}: ReportResponseTabGroupProps) => {
  const responseTabs = [
    {
      slug: 'response-body',
      title: 'Body',
      Component: (
        <JsonEditorPane
          paneValue={response?.responsePayload || ''}
          setPaneValue={() => null}
          isEditable={false}
          isOriginalDoc={hasOriginalDoc}
          highlightedDiffKey={highlightedDiffKey}
          diffKeys={diffKeys}
        />
      ),
    },
    {
      slug: 'response-headers',
      title: 'Headers',
      Component: (
        <ResponseHeaderPane headers={response?.responseHeaders || {}} />
      ),
    },
    {
      slug: 'response-status',
      title: 'Status',
      Component: <div>{response?.statusCode}</div>,
    },
  ];
  return (
    <Tabs
      forceRenderTabPanel
      selectedIndex={activeTab}
      onSelect={onSelect}
      selectedTabClassName="border-b-2 text-blue-600"
    >
      <TabList className="flex mt-5 border border-gray-300 rounded-t-lg hide-scroll">
        {responseTabs.map(({ slug, title }) => (
          <Tab
            className="mr-3 py-2 px-4 border-blue-500 focus:outline-none text-blue-500 hover:text-blue-500 cursor-pointer"
            key={slug}
          >
            {title}
          </Tab>
        ))}
      </TabList>

      <div className="px-4 py-4 rounded-b-lg border border-t-0 border-gray-300 min-h-[400px]">
        {responseTabs.map(({ slug, Component }) => (
          <TabPanel key={slug}>{Component}</TabPanel>
        ))}
      </div>
    </Tabs>
  );
};

export default ReportResponseTabGroup;
