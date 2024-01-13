import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Tab-Groups.css';

import KeyValuePane from '../Panes/KeyValue/KeyValuePane';
import JsonEditorPane from '../Panes/Json/JsonEditorPane';
import AuthPanel from '../Panes/Auth/Authorization';
import ScriptPane from '../Panes/Scripts/Script';
import { Pair } from '../../models';
import { useRef } from 'react';

type RequestTabGroupProps = {
  queryParams: Pair<string[]>;
  /**
   *  setQueryParams Function Type
   */
  setQueryParams: (keyPairs: Pair<string[]>) => void;
  headers: Pair;
  /**
   *  setHeaders Function Type
   */
  setHeaders: (keyPairs: Pair) => void;
  doc: string;
  /**
   *  setDoc Function Type
   */
  setDoc: (doc: string) => void;
  script: string;
  /**
   *  setDoc Function Type
   */
  setPreRequestScript: (script: string) => void;
  tests: string;
  /**
   *  setDoc Function Type
   */
  setTestsScript: (tests: string) => void;
  sessionPRS: string;
  /**
   *  setDoc Function Type
   */
  setSessionPRS: (sessionPRS: string) => void;
  sessionTests: string;
  /**
   *  setDoc Function Type
   */
  setSessionTests: (sessionTests: string) => void;
  title?: string;
  isEditable?: boolean;
};

/**
 *  RequestTabGroup Component
 */
const RequestTabGroup = ({
  queryParams = {},
  setQueryParams,
  headers = {},
  setHeaders,
  doc,
  setDoc,
  script,
  setPreRequestScript,
  tests,
  setTestsScript,
  sessionPRS,
  setSessionPRS,
  sessionTests,
  setSessionTests,
  title = 'Request',
  isEditable = true,
}: RequestTabGroupProps) => {
  const requestTabs = [
    {
      slug: 'query-params',
      title: 'Params',
      Pane: KeyValuePane<string[]>,
      paneValue: queryParams,
      setPaneValue: setQueryParams,
      canDuplicate: true,
      isEditable,
    },
    {
      slug: 'auth',
      title: 'Authorization',
      Pane: AuthPanel,
      paneValue: null,
      setPaneValue: null,
      isEditable,
    },

    {
      slug: 'headers',
      title: 'Headers',
      Pane: KeyValuePane<string>,
      paneValue: headers,
      setPaneValue: setHeaders,
      isEditable,
    },

    {
      slug: 'body',
      title: 'Body',
      Pane: JsonEditorPane,
      paneValue: doc,
      setPaneValue: setDoc,
      isEditable,
    },
    {
      slug: 'pre-request-script',
      title: 'Pre-request Script',
      Pane: ScriptPane,
      paneValue: script,
      setPaneValue: setPreRequestScript,
      isEditable,
    },
    {
      slug: 'tests-script',
      title: 'Tests',
      Pane: ScriptPane,
      paneValue: tests,
      setPaneValue: setTestsScript,
      isEditable,
    },
    {
      slug: 'session-pre-request-script',
      title: 'Session PRS',
      Pane: ScriptPane,
      paneValue: sessionPRS,
      setPaneValue: setSessionPRS,
      isEditable,
    },
    {
      slug: 'session-tests-script',
      title: 'Session Tests',
      Pane: ScriptPane,
      paneValue: sessionTests,
      setPaneValue: setSessionTests,
      isEditable,
    },
  ];

  const titleRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="my-4">
      <div ref={titleRef} className="flex justify-start items-center">
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
          {requestTabs.map(({ slug, title }) => (
            <Tab
              className="text-base mr-2 py-2 px-2 border-blue-500 focus:outline-none 
                          hover:text-blue-500 cursor-pointer text-blue-500 whitespace-nowrap"
              key={slug}
              style={{
                minWidth: slug === 'pre' ? 160 : 'auto',
              }}
            >
              {title}
            </Tab>
          ))}
        </TabList>

        {requestTabs.map(({ title, slug, Pane, ...rest }) => (
          <TabPanel
            className={`react-tabs__tab-panel ${
              slug.includes('script') ? 'py-2' : 'px-4 py-4 '
            } rounded-b-lg border border-t-0 border-gray-300 min-h-[300px] `}
            key={slug}
          >
            <Pane {...(rest as any)} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default RequestTabGroup;
