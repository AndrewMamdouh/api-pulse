import { Fragment, useRef, useState } from 'react';
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import { Button, InputGroup } from '../../UI';
import {
  generateFlowPayload,
  getJsonLeafNodes,
  safeJSONParse,
} from '../../../utils/helpers';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { saveFlow } from '../../../api/postServices';
import { useLocalStorage } from '../../../hooks';
import {
  ApiChainRequestType,
  WorkflowExecuteRequest,
} from '../../../models/requestModels';
import { v4 as uuidv4 } from 'uuid';
import { ModalProps } from '../types';
import { VariableKeyLocation, VariableLocation } from '../../../models';

interface SaveFlowModalProps extends ModalProps {
  /**
   *
   */
  fetchFlows: () => void;
}
/**
 * SaveFlowModal Component
 */
const SaveFlowModal = ({
  isOpen,
  setIsOpen,
  fetchFlows,
}: SaveFlowModalProps) => {
  const cancelButtonRef = useRef(null);
  const flowNameRef = useRef<HTMLInputElement>(null);
  const { setItem } = useLocalStorage();
  const [apiChainRequestType, setApiChainRequestType] =
    useState<ApiChainRequestType>(ApiChainRequestType.FIXED);
  const newFlow = useSelector((state: RootState) => state.flow.newFlow);

  if (!newFlow) return null;

  /**
   *  Cancel Button Click Handler
   */
  const cancelHandler = () => setIsOpen(false);

  /**
   *  Save Button Click Handler (Save Flow)
   */
  const saveHandler = async () => {
    if (!flowNameRef.current) return;
    const envVarRegex = new RegExp(/\{\{([^}]+)\}\}/);

    const flow: WorkflowExecuteRequest = {
      ...(await generateFlowPayload(newFlow, false)),
      apiOwnerId: 'xxx123',
      flowName: flowNameRef.current.value,
      id: uuidv4(),
      apiChainRequestType,
    };

    const flowWithEnvPaths = {
      ...flow,
      apiSampleNodes: flow.apiSampleNodes.map((sampleNode) => {
        const paramEnvPaths = getJsonLeafNodes(sampleNode.parameters)
          .filter(
            ({ value }) => typeof value === 'string' && value.match(envVarRegex)
          )
          .map(
            ({ value, path }) =>
              ({
                varKey: value,
                varPath: path,
                varLocation: VariableLocation.QUERY_PARAMETER,
              } as VariableKeyLocation)
          );
        const headerEnvPaths = getJsonLeafNodes(sampleNode.requestHeaders)
          .filter(
            ({ value }) => typeof value === 'string' && value.match(envVarRegex)
          )
          .map(
            ({ value, path }) =>
              ({
                varKey: value,
                varPath: path,
                varLocation: VariableLocation.HEADER_KEY,
              } as VariableKeyLocation)
          );
        const payloadEnvPaths = getJsonLeafNodes(
          safeJSONParse(sampleNode.requestPayload)
        )
          .filter(
            ({ value }) => typeof value === 'string' && value.match(envVarRegex)
          )
          .map(
            ({ value, path }) =>
              ({
                varKey: value,
                varPath: path,
                varLocation: VariableLocation.REQUEST_BODY,
              } as VariableKeyLocation)
          );

        return {
          ...sampleNode,
          envVarPaths: [
            ...paramEnvPaths,
            ...headerEnvPaths,
            ...payloadEnvPaths,
          ],
        };
      }),
    };

    const res = await saveFlow([flowWithEnvPaths]);

    if (res) {
      toast.success('data saved to DB');
      await fetchFlows();
      setItem('current', JSON.stringify(flow));
    }

    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <InputGroup ref={flowNameRef}>Flow Name</InputGroup>
                <div className="flex flex-col gap-1.5 mt-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Request Type
                  </label>
                  <RadioGroup
                    value={apiChainRequestType}
                    onChange={setApiChainRequestType}
                  >
                    <RadioGroup.Label className="sr-only">
                      ApiChainRequest Type
                    </RadioGroup.Label>
                    <div className="flex gap-2">
                      {Object.keys(ApiChainRequestType)
                        .filter((type) => isNaN(Number(type)))
                        .map((type) => (
                          <RadioGroup.Option
                            key={type}
                            value={type}
                            className={({ active, checked }) =>
                              `flex w-full items-center justify-center cursor-pointer rounded-lg p-2 shadow-sm focus:outline-none ring-1 ring-gray-300
                              ${
                                active
                                  ? 'ring-offset-2 ring-offset-blue-400'
                                  : ''
                              }
                              ${checked ? 'bg-blue-600 text-white' : 'bg-white'}
                              `
                            }
                          >
                            {type[0] + type.toLowerCase().slice(1)}
                          </RadioGroup.Option>
                        ))}
                    </div>
                  </RadioGroup>
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <Button size="lg" variant="secondary" onClick={cancelHandler}>
                    Cancel
                  </Button>
                  <Button size="lg" onClick={saveHandler}>
                    Save
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SaveFlowModal;
