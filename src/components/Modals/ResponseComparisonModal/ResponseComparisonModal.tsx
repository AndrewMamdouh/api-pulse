import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ReportResponseTabGroup from '../../Tab-Groups/ReportResponseTabGroup';
import { ApiSampleNode } from '../../../models';
import { CloseIcon } from '../../../fa-icons';
import { DetailedDiffNodeData } from '../../../utils/helpers';
import { ModalProps } from '../types';

/**
 * ResponseComparisonModal Props Type
 */
type ResponseComparisonModalProps = ModalProps & {
  expectedSample: ApiSampleNode | null;
  currentSample: ApiSampleNode | null;
  highlightedDiffKey?: string;
  diffNodeData?: DetailedDiffNodeData;
};

/**
 * ResponseComparisonModal Component
 */
const ResponseComparisonModal = ({
  currentSample,
  expectedSample,
  diffNodeData,
  highlightedDiffKey,
  isOpen,
  setIsOpen,
}: ResponseComparisonModalProps) => {
  const cancelButtonRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  const currentSampleDiffKeys =
    diffNodeData?.valueDifferences
      .filter((diff) => diff.key !== highlightedDiffKey)
      .map((diff) => diff.key) || [];
  const expectedSampleDiffKeys = [...currentSampleDiffKeys];
  currentSampleDiffKeys.push(
    ...(diffNodeData?.extraKeys
      .filter((diff) => diff.key !== highlightedDiffKey)
      .map((diff) => diff.key) || [])
  );
  expectedSampleDiffKeys.push(
    ...(diffNodeData?.missingKeys
      .filter((diff) => diff.key !== highlightedDiffKey)
      .map((diff) => diff.key) || [])
  );

  /**
   * Triggers when select any tab
   */
  const tabSelectHandler = (tabIdx: number) => {
    activeTab !== tabIdx && setActiveTab(tabIdx);
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xl w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center"
                >
                  <CloseIcon />
                </button>
                <div className="mt-4 flex gap-6">
                  <div className="w-1/2">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-gray-900"
                    >
                      Current
                    </Dialog.Title>
                    <ReportResponseTabGroup
                      activeTab={activeTab}
                      onSelect={tabSelectHandler}
                      response={currentSample}
                      hasOriginalDoc={true}
                      diffKeys={currentSampleDiffKeys}
                      highlightedDiffKey={highlightedDiffKey}
                    />
                  </div>
                  <div className="w-1/2">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-gray-900"
                    >
                      Expected
                    </Dialog.Title>
                    <ReportResponseTabGroup
                      activeTab={activeTab}
                      onSelect={tabSelectHandler}
                      response={expectedSample}
                      hasOriginalDoc={false}
                      diffKeys={expectedSampleDiffKeys}
                      highlightedDiffKey={highlightedDiffKey}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ResponseComparisonModal;
