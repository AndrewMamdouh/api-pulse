import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ThreeDots } from 'react-loader-spinner';
import JsonEditorPane from '../Panes/Json/JsonEditorPane';
import ResponseHeaderPane from '../Panes/ResponseHeader/ResponseHeaderPane';
import { ApiSampleNode } from '../../models';
import { formatDate } from '../../utils/helpers';
import prettyBytes from 'pretty-bytes';

type ResponseTabGroupProps = {
  doc: string;
  /**
   *  setDoc Function Type
   */
  setDoc: (doc: string) => void;
  response: Partial<ApiSampleNode> | null;
  loading: boolean;
};

/**
 *  ResponseTabGroup Component
 */
const ResponseTabGroup = ({
  doc,
  setDoc,
  response,
  loading,
}: ResponseTabGroupProps) => {
  const size = prettyBytes(
    (response?.responsePayload
      ? JSON.stringify(response?.responsePayload).length
      : 0) +
      (response?.responseHeaders
        ? JSON.stringify(response?.responseHeaders).length
        : 0)
  );

  const responseTabs = [
    {
      slug: 'response-body',
      title: 'Body',
      Component: loading ? (
        <ThreeDots height="30" width="30" color="gray" visible={true} />
      ) : (
        <JsonEditorPane
          paneValue={doc}
          setPaneValue={setDoc}
          isEditable={false}
        />
      ),
    },
    {
      slug: 'response-headers',
      title: 'Headers',
      Component: loading ? (
        <ThreeDots height="30" width="30" color="gray" visible={true} />
      ) : (
        <ResponseHeaderPane headers={response?.responseHeaders || {}} />
      ),
    },
    {
      slug: 'response-status',
      title: 'Status',
      Component: loading ? (
        <ThreeDots height="30" width="30" color="gray" visible={true} />
      ) : (
        <div>{response?.statusCode}</div>
      ),
    },
    {
      slug: 'response-time',
      title: 'Time',
      Component: loading ? (
        <ThreeDots height="30" width="30" color="gray" visible={true} />
      ) : (
        <div>{formatDate(response?.timestamp || '')}</div>
      ),
    },
    {
      slug: 'response-Size',
      title: 'Size',
      Component: loading ? (
        <ThreeDots height="30" width="30" color="gray" visible={true} />
      ) : (
        <div>{size}</div>
      ),
    },
  ];
  return (
    <Tabs forceRenderTabPanel selectedTabClassName="border-b-2 text-blue-600">
      <TabList
        className="flex mt-5 border border-gray-300 rounded-t-lg hide-scroll"
        style={{
          overflowX: 'scroll',
          // maxWidth: 460,
          maxHeight: 50,
        }}
      >
        {responseTabs.map(({ slug, title }) => (
          <Tab
            className="text-sm mr-2 py-2 px-2 border-blue-500 focus:outline-none text-blue-500 hover:text-blue-500 cursor-pointer"
            key={slug}
          >
            {title}
          </Tab>
        ))}
      </TabList>

      <div className="px-4 py-4 rounded-b-lg border border-t-0 border-gray-300 min-h-[300px]">
        {responseTabs.map(({ slug, Component }) => (
          <TabPanel key={slug}>{Component}</TabPanel>
        ))}
      </div>
    </Tabs>
  );
};

export default ResponseTabGroup;
