import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import { FlowOverviewProjectionDTO } from '../../../models/reportModel';
import { workFlowReplayRequest } from '../../../models/requestModels';
import { getRecordedPayload, workFlowReplay } from '../../../api/getServices';
import toast from 'react-hot-toast';
import {
  formatDate,
  generateFlowPayload,
  resolvePromisesSequentially,
} from '../../../utils/helpers';
import { CheckIcon } from '../../../fa-icons/index';
import { useLocalStorage } from '../../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ModalProps } from '../types';

/**
 * RecordedIdsListModal Props Type
 */
type RecordedIdsListModalProps = ModalProps & {
  recordedList: FlowOverviewProjectionDTO[] | null;
};

/**
 * To Normalize Record Into Data To Be Displayed In RecordedIdsListModal
 */
type NormalizedRecord = {
  id: string;
  date: string;
  time: string;
  name: string;
};

/**
 * RecordedIdsListModal Component
 */
const RecordedIdsListModal = ({
  recordedList,
  isOpen,
  setIsOpen,
}: RecordedIdsListModalProps) => {
  const [selectedReplayId, setSelectedReplayId] = useState<string | null>(null);
  const cancelButtonRef = useRef(null);
  const { setItem } = useLocalStorage();
  const selectedFlows = useSelector(
    (state: RootState) => state.flow.selectedFlows
  );

  useEffect(() => {
    recordedList?.length && setSelectedReplayId(recordedList[0].id);
  }, [recordedList]);

  if (!recordedList) return null;

  const normalizedRecordedList: NormalizedRecord[] = recordedList.map(
    ({ id, createdAt, name }) => {
      const dateTimeArr = formatDate(createdAt).split(' ');
      return {
        name,
        id,
        date: dateTimeArr[0],
        time: dateTimeArr[1],
      };
    }
  );

  /**
   * Replay Flow Action
   */
  const handleReplay = async () => {
    const payloadRecordRequestId = recordedList.find(
      (record) => record.id === selectedReplayId
    )?.payloadRecordRequestId;
    if (!selectedReplayId || !payloadRecordRequestId) return;
    setIsOpen(false);
    const recordedPayload = await getRecordedPayload(payloadRecordRequestId);
    if (recordedPayload) {
      try {
        const flows = recordedPayload.apiResponsesDiffChains
          .filter((diffChain) => selectedFlows.includes(diffChain.flowId))
          .map((diffChain) => diffChain.currentApiResponseChain);

        const apiChainListToExecuteOnPr = await resolvePromisesSequentially(
          flows,
          generateFlowPayload
        );

        const workFlowReplayRequestObj: workFlowReplayRequest = {
          apiChainListToExecuteOnPr,
          flowComparisonsReportOverViewId: selectedReplayId,
        };
        const res = await workFlowReplay(workFlowReplayRequestObj);
        console.log('handleReplay', { res });
        if (res) {
          setItem('reportData', JSON.stringify(res));
          toast.success('handleReplay and report generated successfully!');
        }
      } catch (err) {
        console.error(err);
        toast.error("This Variable Doesn't Exist!!");
      }
    }
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
                {normalizedRecordedList.length ? (
                  <>
                    <div className="mt-3 text-center">
                      <Dialog.Title
                        as="h3"
                        className="text-xl text-center font-bold leading-6 text-gray-900"
                      >
                        Choose One From Below
                      </Dialog.Title>
                      <div className="w-full px-4 py-6">
                        <RadioGroup
                          value={selectedReplayId}
                          onChange={setSelectedReplayId}
                        >
                          <RadioGroup.Label className="sr-only">
                            Server size
                          </RadioGroup.Label>
                          <div className="space-y-4">
                            {normalizedRecordedList.map(
                              ({ id, date, time, name }) => (
                                <RadioGroup.Option
                                  key={id}
                                  value={id}
                                  className={({ active, checked }) =>
                                    `${
                                      active
                                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-blue-700'
                                        : ''
                                    }
                  ${checked ? 'bg-blue-600 text-white' : 'bg-white'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-sm focus:outline-none`
                                  }
                                >
                                  {({ active, checked }) => (
                                    <div className="flex w-full items-center justify-between">
                                      <div className="flex justify-start">
                                        <div className="text-sm">
                                          <RadioGroup.Label
                                            as="p"
                                            className={`font-medium text-left ${
                                              checked
                                                ? 'text-white'
                                                : 'text-black'
                                            }`}
                                          >
                                            {name || id}
                                          </RadioGroup.Label>
                                          <RadioGroup.Description
                                            as="span"
                                            className={`flex flex-col items-start ${
                                              checked
                                                ? 'text-white'
                                                : 'text-black'
                                            }`}
                                          >
                                            <span>
                                              Date:{' '}
                                              <span className="font-semibold">
                                                {date}
                                              </span>
                                            </span>
                                            <span>
                                              Time:{' '}
                                              <span className="font-semibold">
                                                {time}
                                              </span>
                                            </span>
                                          </RadioGroup.Description>
                                        </div>
                                      </div>
                                      {checked && (
                                        <div className="shrink-0 text-white text-2xl">
                                          <CheckIcon />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </RadioGroup.Option>
                              )
                            )}
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 sm:ml-3 sm:w-auto"
                        onClick={handleReplay}
                      >
                        Choose
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setIsOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <Dialog.Title
                    as="h3"
                    className="text-xl text-center font-bold leading-6 text-gray-900"
                  >
                    You Don't Have Any Recorded Flows Yet...
                  </Dialog.Title>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default RecordedIdsListModal;
