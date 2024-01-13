import { FunctionComponent } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { ApiSampleNode } from '../../../../models';

/**
 *  RequestNode Component
 */
const RequestNode: FunctionComponent<NodeProps<ApiSampleNode>> = ({ data }) => {
  return (
    <>
      <div className="p-2 bg-white rounded-md border-2 border-black">
        <Handle type="target" position={Position.Left} />
        <div className="flex flex-row align-middle">
          <div
            className={`method ${data.method.toLowerCase()} inline-block align-middle`}
          >
            {data.method}
          </div>

          <div>{data.uri.uriPath}</div>
        </div>

        <Handle type="source" position={Position.Right} id="a" />
      </div>
    </>
  );
};

export default RequestNode;
