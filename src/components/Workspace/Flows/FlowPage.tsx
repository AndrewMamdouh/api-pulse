import { DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import 'react-responsive-modal/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlowInstance,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from 'reactflow';

import CustomEdge from './CustomEdge';
import Modal from 'react-responsive-modal';
import RequestNode from './Nodes/RequestNode';
import RequestMapper from './Modals/RequestMapper';
import RequestEditorModal from './Modals/RequestEditor';
import { ApiStatusData } from '../../Layout/Sidebar/MenuItem';
import { executeWorkflowRequest, getFlowData } from '../../../api/getServices';
import { ApiSampleMappingNode, ApiSampleNode } from '../../../models';
import {
  ApiChainRequestType,
  WorkflowExecuteResponse,
} from '../../../models/requestModels';
import { RootState } from '../../../store';
import { updateWorkFlow } from '../../../api/postServices';
import {
  addNewNodeToFlow,
  closeRequestEditor,
  closeRequestMapperEditor,
  setNewFlow,
  openRequestEditor,
  openComparisonEditor,
  closeComparisonEditor,
  updateNewFlow,
  updateAllFlows,
} from '../../../slices/flowSlice';
import {
  convertApiSampleToApiSampleNode,
  generateFlowPayload,
} from '../../../utils/helpers';
import { DRAGGABLE_DATA_PATH, DRAGGABLE_TYPE_PATH } from '../../dnd';
import { DELETE, EXECUTE, SAVE } from '../../../constants';
import { useClicker, useLocalStorage } from '../../../hooks';
import ComparisonEditor from './Modals/ComparisonEditor';
import { SaveFlowModal } from '../../Modals';

const initNodes = [
  {
    id: 'start',
    position: { x: 0, y: 0 },
    data: { label: 'StartNode' },
    type: 'input',
  },
];

const edgeTypes = {
  mapperEdge: CustomEdge,
};

const nodeTypes = {
  requestNode: RequestNode,
};

export type iEdgeTypes = keyof typeof edgeTypes;
export type iNodeTypes = keyof typeof nodeTypes;
/**
 *  FlowPage Component
 */
const FlowPage = () => {
  const [nodes, setNodes] = useState<Node[]>(initNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selection, setSelection] = useState<string[]>([]);
  const [response, setResponse] = useState<WorkflowExecuteResponse | null>(
    null
  );
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSaveFlowModalOpen, setIsSaveFlowModalOpen] = useState(false);
  const { setViewport } = useReactFlow();

  const newFlow = useSelector((state: RootState) => state.flow.newFlow);
  const allFlows = useSelector((state: RootState) => state.flow.flows);
  const dispatch = useDispatch();

  useEffect(() => {
    const flowExists = allFlows.find((flow) => flow.id === newFlow.id);
    if (flowExists) setIsUpdate(true);
    else setIsUpdate(false);
  }, [allFlows, newFlow.id]);

  /**
   * Fetch Flows
   */
  const fetchFlows = useCallback(async () => {
    const result = await getFlowData();
    result && dispatch(updateAllFlows(result));
  }, [dispatch]);

  /**
   *  Add New Flow Node
   */
  const addNewNode = useCallback(
    (new_request: ApiSampleNode) => {
      dispatch(addNewNodeToFlow(new_request));
    },
    [dispatch]
  );

  const canvasWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const requestEditorState = useSelector(
    (store: RootState) => store.flow.requestEditModal
  );

  const requestMapperEditorState = useSelector(
    (store: RootState) => store.flow.requestMapperEditModal
  );

  const comparisonEditorState = useSelector(
    (store: RootState) => store.flow.comparisonEditModal
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      node.id !== 'start' &&
        dispatch(
          openRequestEditor({
            request:
              newFlow.apiSampleNodes.find(
                (apiSample) => apiSample.nodeId === node.data.nodeId
              ) || node.data,
            response: response?.find(
              (apiSample) => apiSample.nodeId === node.data.nodeId
            ),
          })
        );
    },
    [dispatch, newFlow, response]
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, { id }: Node) => {
      if (id !== 'start') {
        const savedComparisonConfigIdx = newFlow.apiSampleNodes.findIndex(
          (node) => node.nodeId === id
        );
        const savedComparisonConfig =
          savedComparisonConfigIdx === -1
            ? []
            : newFlow.apiSampleNodes[savedComparisonConfigIdx]
                .comparisonConfigs || [];

        dispatch(
          openComparisonEditor({
            request: { comparisonConfigs: savedComparisonConfig, id },
          })
        );
      }
    },
    [dispatch, newFlow.apiSampleNodes]
  );

  const [handleSingleClick, handleDoubleClick] = useClicker({
    onSingleClick: onNodeClick,
    onDoubleClick: onNodeDoubleClick,
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      let edgeId: undefined | string = undefined;
      if (params.source !== 'start') {
        edgeId = uuidv4();
        const sourceNode = nodes.find((n) => n.id === params.source);
        const targetNode = nodes.find((n) => n.id === params.target);

        if (!sourceNode?.data.id || !targetNode?.data.id)
          throw Error("onConnect:Can't find the API id from nodes list");

        const updatedConvertors = [
          ...newFlow.apiSampleConvertorNodes,
          {
            nodeId: edgeId,
            sourceNodeId: sourceNode.data.nodeId,
            targetNodeId: targetNode.data.nodeId,
            headerMapping: [],
            queryParamMapping: [],
            requestBodyMapping: [],
          },
        ];
        dispatch(
          setNewFlow({
            ...newFlow,
            apiSampleConvertorNodes: updatedConvertors,
          })
        );
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: edgeId || '',
            type: params.source === 'start' ? 'default' : 'mapperEdge',
            data: {
              nodeId: edgeId,
              sourceNodeId: params.source,
              targetNodeId: params.target,
              headerMapping: {},
              queryParamMapping: {},
              requestBodyMapping: {},
            } as ApiSampleMappingNode,
          },
          eds
        )
      );
    },
    [nodes, newFlow, dispatch]
  );

  const onDragOver = useCallback((event: any) => {
    event?.preventDefault();

    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const reactFlowBounds = canvasWrapper.current?.getBoundingClientRect();
      const type = e.dataTransfer?.getData(DRAGGABLE_TYPE_PATH);
      let apiStatus: ApiStatusData[] = JSON.parse(
        e.dataTransfer?.getData(DRAGGABLE_DATA_PATH)
      );

      const desiredApiStatus =
        apiStatus.find(
          (api) => api?.statusCode >= 200 && api?.statusCode < 300
        ) || apiStatus[0];
      // check if there are any valid requests

      const position = reactFlowInstance!.project({
        x: e.clientX - (reactFlowBounds?.left || 0),
        y: e.clientY - (reactFlowBounds?.top || 0),
      });

      const nodeId = uuidv4();
      const request = desiredApiStatus?.requestData?.[0];

      if (request) {
        const newApiSampleNode = convertApiSampleToApiSampleNode(request);

        const newNode = {
          id: nodeId,
          type,
          position,
          data: newApiSampleNode,
          style: {
            // Conditionally set the node color based on statusCode
            color:
              newApiSampleNode.statusCode >= 200 &&
              newApiSampleNode.statusCode < 300
                ? 'green'
                : 'red',
            // You can customize other style properties here
          },
        };
        setNodes((nds) => nds.concat(newNode));
        //dispatch(addNode({ flowId: FLOW_ID, request: new_request }));
        addNewNode(newApiSampleNode);
      }
    },
    [addNewNode, reactFlowInstance]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      setItem('newFlow', JSON.stringify(flow));
    }
  }, [reactFlowInstance, setItem]);

  const onRestore = useCallback(() => {
    /**
     *  Restore Previous Flow
     */
    const restoreFlow = async () => {
      const flow = JSON.parse(getItem('newFlow') || '{}');

      if (Object.keys(flow)) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [getItem, setViewport]);

  useEffect(() => {
    if (getItem('newFlow')) onRestore();
    return () => onSave();
  }, [getItem, onRestore, onSave]);

  useEffect(() => {
    onSave();
  }, [newFlow, onSave]);

  /**
   *
   */
  const triggerChildEffect = () => {
    // Do nothing here, we just need the callback to trigger the child's useEffect
  };
  /**
   *  Execute Flow
   */
  const handleExecute = async () => {
    try {
      const payload = await generateFlowPayload(newFlow);
      const res = await executeWorkflowRequest(payload);
      console.log('executeWorkflowRequest', res);
      setResponse(res);
      triggerChildEffect();
      toast.success('Request executed successfully!');
    } catch (error) {
      console.error({ error });
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  /**
   *
   */
  const handleReset = () => {
    dispatch(
      setNewFlow({
        apiSampleConvertorNodes: [],
        apiSampleNodes: [],
        flowName: '',
        id: uuidv4(),
        apiOwnerId: 'some_owner_id',
        apiChainRequestType: ApiChainRequestType.FIXED,
      })
    );
    removeItem('newFlow');
    setNodes(initNodes);
    setEdges([]);
  };

  /**
   *
   */
  const handleUpdate = async () => {
    if (!isUpdate) return;
    const res = await updateWorkFlow(newFlow);
    await fetchFlows();
    res && toast.success('Flow Updated Successfully');
  };

  /**
   *  Delete Edge
   */
  const deleteEdge = (edgeId: any) => {
    const updatedEdges = edges.filter((edge) => edge.id !== edgeId);
    setEdges(updatedEdges);
  };

  /**
   *  Delete Node
   */
  const deleteNode = () => {
    // Filter out the selected nodes and edges from the current nodes and edges
    const filteredNodes = nodes.filter(
      (node) => node.id === 'start' || !selection.includes(node.id)
    );
    const filteredApiSampleNodes: ApiSampleNode[] = filteredNodes
      .filter(({ id }) => id !== 'start')
      .map(({ data }) => data);
    const filteredEdges = edges.filter(
      (edge) =>
        !selection.includes(edge.source) && !selection.includes(edge.target)
    );
    const filteredApiSampleConverterNodes: ApiSampleMappingNode[] =
      filteredEdges
        .filter(({ source }) => source !== 'start')
        .map(({ data }) => data);

    // Update the state with the filtered nodes and edges
    setNodes(filteredNodes);
    setEdges(filteredEdges);

    // Clear the selection after deletion
    setSelection([]);

    // Dispatch the action to update the allFlows state
    dispatch(
      updateNewFlow({
        apiSampleNodes: filteredApiSampleNodes,
        apiSampleConvertorNodes: filteredApiSampleConverterNodes,
      })
    );
  };

  const onSelectionChange = useCallback(
    (selectedElements: any) => {
      const selectedNodeIds = selectedElements.nodes.map(
        (node: any) => node.id
      );

      setSelection(selectedNodeIds);
    },
    [setSelection]
  );

  const buttonClass =
    'ml-3 px-6 py-2 rounded-md font-semibold text-white hover:bg-orange-600';

  return (
    <div
      className="flex flex-col relative"
      style={{ height: 'calc(100vh - 100px)' }}
    >
      <div className="mb-2">
        <button
          onClick={() => setIsSaveFlowModalOpen(true)}
          className="ml-3 px-6 py-2 rounded-md font-semibold text-blue-500 border-blue-500 border-solid hover:bg-blue-300"
        >
          {SAVE}
        </button>
        <button
          onClick={handleExecute}
          className={`${buttonClass} bg-blue-500`}
        >
          {EXECUTE}
        </button>
        <button onClick={deleteNode} className={`${buttonClass} bg-red-500`}>
          {DELETE}
        </button>
        {isUpdate ? (
          <button
            onClick={handleUpdate}
            className="ml-3 px-6 py-2 rounded-md font-semibold text-white bg-yellow-500 hover:bg-yellow-400"
          >
            Update
          </button>
        ) : null}

        {newFlow.apiSampleNodes.length ? (
          <button
            onClick={handleReset}
            className="ml-3 px-6 py-2 rounded-md font-semibold text-white bg-black hover:bg-black/90"
          >
            Reset
          </button>
        ) : null}
      </div>
      <div className="h-full w-full" ref={canvasWrapper}>
        <ReactFlow
          onNodeClick={handleSingleClick}
          onNodeDoubleClick={handleDoubleClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodes={nodes}
          edges={edges}
          onSelectionChange={onSelectionChange}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e)}
          onInit={(rfi) => setReactFlowInstance(rfi)}
          onConnect={onConnect}
          onEdgeContextMenu={(event, edge) => {
            event.preventDefault();
            const confirmDelete = window.confirm('Delete this edge?');
            if (confirmDelete) {
              deleteEdge(edge.id);
            }
          }}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <Modal
        center
        container={canvasWrapper.current}
        onClose={() => dispatch(closeRequestEditor())}
        open={requestEditorState.visible}
      >
        {'request' in requestEditorState && (
          <RequestEditorModal
            flowId={''}
            request={requestEditorState.request}
            response={requestEditorState.response || null}
            triggerChildEffect={triggerChildEffect}
          />
        )}
      </Modal>

      <Modal
        center
        container={canvasWrapper.current}
        onClose={() => dispatch(closeRequestMapperEditor())}
        open={requestMapperEditorState.visible}
      >
        {'request' in requestMapperEditorState && (
          <RequestMapper edgeId={requestMapperEditorState.request.nodeId} />
        )}
      </Modal>

      <Modal
        center
        container={canvasWrapper.current}
        onClose={() => dispatch(closeComparisonEditor())}
        open={comparisonEditorState.visible}
      >
        <ComparisonEditor comparisonEditorState={comparisonEditorState} />
      </Modal>
      <SaveFlowModal
        isOpen={isSaveFlowModalOpen}
        setIsOpen={setIsSaveFlowModalOpen}
        fetchFlows={fetchFlows}
      />
    </div>
  );
};

export default FlowPage;
