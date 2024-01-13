import React, { useState, useEffect } from 'react';

import ResponseTabGroup from '../../Tab-Groups/ResponseTabGroup';
import { ApiSampleNode } from '../../../models';

type ResponseProps = {
  response: Partial<ApiSampleNode> | null;
  data: Record<string, string> | string;
  loading: boolean;
};

/**
 *  Response Component
 */
export default function Response({ response, data, loading }: ResponseProps) {
  const [doc, setDoc] = useState(
    typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  );

  useEffect(() => {
    setDoc(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  }, [data]);

  return (
    <div className="my-4">
      <div className="flex flex-col items-start">
        <span className="text-xl font-medium pt-3">Response</span>
      </div>
      <ResponseTabGroup
        doc={doc}
        setDoc={setDoc}
        response={response}
        loading={loading}
      />
    </div>
  );
}
