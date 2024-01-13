import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlowInstance,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Modal from 'react-responsive-modal';
import { getRecordedIdsList, workFlowRecord } from '../../../api/getServices';
import {
  convertFlowToReactFlowState,
  generateFlowPayload,
  mergeLatestRequestDataWithFlows,
  resolvePromisesSequentially,
} from '../../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import 'react-responsive-modal/styles.css';
import {
  closeComparisonEditor,
  closeRequestEditor,
  openRequestEditor,
  openComparisonEditor,
  closeRequestMapperEditor,
  updateAllFlows,
} from '../../../slices/flowSlice';
import CustomEdge from '../Flows/CustomEdge';
import RequestNode from '../Flows/Nodes/RequestNode';
import toast from 'react-hot-toast';
import { workFlowRecordRequest } from '../../../models/requestModels';
import { RootState } from '../../../store';
import { useClicker, useLocalStorage } from '../../../hooks';
import RequestEditorModal from '../Flows/Modals/RequestEditor';
import ComparisonEditor from '../Flows/Modals/ComparisonEditor';
import { ApiSampleNode, Flow } from '../../../models';
import { setRecord } from '../../../slices/latestRecordSlice';
import RequestMapper from '../Flows/Modals/RequestMapper';
import { FlowOverviewProjectionDTO } from '../../../models/reportModel';
import { RecordSubmitModal, RecordedIdsListModal } from '../../Modals';

const edgeTypes = {
  mapperEdge: CustomEdge,
};
const nodeTypes = {
  requestNode: RequestNode,
};
export type iEdgeTypes = keyof typeof edgeTypes;
export type iNodeTypes = keyof typeof nodeTypes;

/**
 * MockServerPage Component
 */
const SavedFlowsPage = () => {
  const dispatch = useDispatch();
  const selectedFlow = useSelector((state: RootState) => state.selectedFlow);
  const [, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const canvasWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [response] = useState<ApiSampleNode | null>(null);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordName, setRecordName] = useState<string>('');
  const [recordedList, setRecordedList] = useState<
    FlowOverviewProjectionDTO[] | null
  >(null);
  const { setItem } = useLocalStorage();

  useEffect(() => {
    if (recordedList) {
      setIsReplayModalOpen(true);
    } else {
      setIsReplayModalOpen(false);
    }
    //eslint-disable-next-line
  }, [recordedList]);

  const requestEditorState = useSelector(
    (store: RootState) => store.flow.requestEditModal
  );
  const requestMapperEditorState = useSelector(
    (store: RootState) => store.flow.requestMapperEditModal
  );
  const comparisonEditorState = useSelector(
    (store: RootState) => store.flow.comparisonEditModal
  );
  const allFlows = useSelector((state: RootState) => state.flow.flows);
  const requestData = useSelector(
    (state: RootState) => state.latestRequestData
  );

  const onRecordNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setRecordName(event.target.value),
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: any) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      dispatch(openRequestEditor({ request: node.data }));
    },
    [dispatch]
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, { id, data }: Node) => {
      dispatch(
        openComparisonEditor({
          request: { comparisonConfigs: data.comparisonConfigs || [], id },
        })
      );
    },
    [dispatch]
  );

  const [handleSingleClick, handleDoubleClick] = useClicker({
    onSingleClick: onNodeClick,
    onDoubleClick: onNodeDoubleClick,
  });

  /**
   *
   */
  const triggerChildEffect = () => {
    // Do nothing here, we just need the callback to trigger the child's useEffect
  };

  useEffect(() => {
    if (!allFlows?.length) return;

    setNodes([]);
    setEdges([]);

    if (!selectedFlow || !Object.keys(selectedFlow).length) return;

    let flow = allFlows.find((flow) => flow.id === selectedFlow.id);
    //setItem('flows', JSON.stringify(allFlows));
    const state = flow && convertFlowToReactFlowState(flow);

    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
    }
  }, [allFlows, selectedFlow, setItem]);

  /**
   * Generate Flow Payload
   */
  const generateSavedFlowsPayload = (flows: Flow[]) =>
    resolvePromisesSequentially(flows, generateFlowPayload);

  /**
   * Expected Payload is First
   * Current Payload is Second
   */
  const handleSubmitRecord = async () => {
    try {
      const updatedFlows = mergeLatestRequestDataWithFlows(
        requestData,
        allFlows
      );
      dispatch(updateAllFlows(updatedFlows));
      const expectedPayload = await generateSavedFlowsPayload(updatedFlows);
      const currentPayload = await generateSavedFlowsPayload(updatedFlows);

      // Map over the payloads and construct the apiResponsesDiffChains array
      const apiResponsesDiffChains = expectedPayload.map((expected, index) => {
        return {
          expectedApiResponseChain: expected,
          currentApiResponseChain: currentPayload[index],
          flowId: expected.id,
        };
      });

      const workFlowRecordRequestObj: workFlowRecordRequest = {
        apiResponsesDiffChains: apiResponsesDiffChains,
        name: recordName,
      };

      const res = await workFlowRecord(workFlowRecordRequestObj);
      console.log('handleRecord', { res });
      setIsRecordModalOpen(false);
      setRecordName('');
      res && dispatch(setRecord(res));
      toast.success('handleRecord successfully!');
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
  const handleRecord = () => {
    setIsRecordModalOpen(true);
  };
  /**
   */
  const handleReplay = async () => {
    setRecordedList(await getRecordedIdsList());
  };

  return (
    <div className="flex h-full">
      <div
        className="flex flex-col basis-full relative"
        style={{ height: 'calc(100vh - 100px)' }}
      >
        <div className="mb-3">
          <button
            onClick={handleRecord}
            className="ml-3 px-6 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-orange-600"
          >
            Record
          </button>

          <button
            onClick={handleReplay}
            className="ml-3 px-6 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-orange-600"
          >
            Replay
          </button>
        </div>
        <ReactFlow
          onNodeClick={handleSingleClick}
          onNodeDoubleClick={handleDoubleClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodes={nodes}
          edges={edges}
          onInit={(rfi) => setReactFlowInstance(rfi)}
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
          <>
            <RequestEditorModal
              flowId={selectedFlow.id}
              request={requestEditorState.request}
              response={response}
              triggerChildEffect={triggerChildEffect}
              isEditable={false}
            />
          </>
        )}
      </Modal>
      <Modal
        center
        container={canvasWrapper.current}
        onClose={() => dispatch(closeRequestMapperEditor())}
        open={requestMapperEditorState.visible}
      >
        {'request' in requestMapperEditorState && (
          <RequestMapper
            edgeId={requestMapperEditorState.request.nodeId}
            isEditable={false}
          />
        )}
      </Modal>
      <Modal
        center
        container={canvasWrapper.current}
        onClose={() => dispatch(closeComparisonEditor())}
        open={comparisonEditorState.visible}
      >
        <ComparisonEditor
          isEditable={false}
          comparisonEditorState={comparisonEditorState}
        />
      </Modal>
      <RecordedIdsListModal
        recordedList={recordedList}
        isOpen={isReplayModalOpen}
        setIsOpen={(isOpen) => setIsReplayModalOpen(isOpen)}
      />
      <RecordSubmitModal
        isOpen={isRecordModalOpen}
        setIsOpen={(isOpen) => setIsRecordModalOpen(isOpen)}
        recordName={recordName}
        setRecordName={onRecordNameChange}
        handleSubmit={handleSubmitRecord}
      />
    </div>
  );
};

export default SavedFlowsPage;
