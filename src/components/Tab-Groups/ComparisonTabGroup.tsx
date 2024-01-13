import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Tab-Groups.css';
import KeyValuePairPane from '../Panes/KeyValue/KeyValuePairPane';
import KeyPane from '../Panes/Key/KeyPane';
//import { Key } from '../../models/reportModel';
import { KeyValuePair } from '../../models/reportModel';

type ComparisonTabGroupProps = {
  ignoredKeys: string[];
  /**
   * setIgnoredKeys Function Type
   */
  setIgnoredKeys: (ignoredKeys: string[]) => void;
  overRidingKeyValues: KeyValuePair[];
  /**
   * setOverRidingKeyValues Function Type
   */
  setOverRidingKeyValues: (overRidingKeyValues: KeyValuePair[]) => void;
  title: string;
  isEditable?: boolean;
};

/**
 * ComparisonTabGroup Component
 */
const ComparisonTabGroup = ({
  ignoredKeys,
  setIgnoredKeys,
  overRidingKeyValues,
  setOverRidingKeyValues,
  title,
  isEditable = true,
}: ComparisonTabGroupProps) => {
  const comparisonTabs = [
    {
      slug: 'ignored-keys',
      title: 'Ignored Keys',
      Pane: KeyPane,
      paneValue: ignoredKeys,
      setPaneValue: setIgnoredKeys,
      isEditable,
    },
    {
      slug: 'overriding-keys',
      title: 'Overriding Keys',
      Pane: KeyValuePairPane,
      paneValue: overRidingKeyValues,
      setPaneValue: setOverRidingKeyValues,
      isEditable,
    },
  ];

  return (
    <div className="w-full my-4">
      <div className="flex justify-start items-center ">
        <span className="text-xl font-medium pt-3">{title}</span>
      </div>
      <Tabs forceRenderTabPanel selectedTabClassName="border-b-2 text-blue-600">
        <TabList
          className="flex mt-5 border border-gray-300 rounded-t-lg hide-scroll"
          style={{
            overflowX: 'scroll',
            maxHeight: 50,
          }}
        >
          {comparisonTabs.map(({ slug, title }) => (
            <Tab
              className="mr-3 py-2 px-3 border-blue-500 focus:outline-none 
                          hover:text-blue-500 cursor-pointer text-blue-500"
              key={slug}
              style={{
                minWidth: 'auto',
              }}
            >
              {title}
            </Tab>
          ))}
        </TabList>

        {comparisonTabs.map(({ title, slug, Pane, ...rest }) => (
          <TabPanel
            className="react-tabs__tab-panel px-4 py-4 rounded-b-lg border border-t-0 border-gray-300 min-h-[400px]"
            key={slug}
          >
            <Pane {...(rest as any)} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default ComparisonTabGroup;
