import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import { useDispatch } from 'react-redux';
import { openRequestMapperEditor } from '../../../slices/flowSlice';
import { ApiSampleMappingNode } from '../../../models';

/**
 *  CustomEdge Component (Mapper Node)
 */
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<ApiSampleMappingNode>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const buttonStyle = {
    backgroundColor: '#007BFF', // Blue color
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    outline: 'none',
    fontSize: '12px',
    marginTop: '8px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3', // Darker blue on hover
  };
  const dispatch = useDispatch();

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            style={buttonStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonHoverStyle.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonStyle.backgroundColor)
            }
            onClick={() => {
              if (!data) {
                alert('No data object for the selected edge');
                return;
              }

              dispatch(openRequestMapperEditor({ request: data }));
            }}
          >
            Map Values
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
