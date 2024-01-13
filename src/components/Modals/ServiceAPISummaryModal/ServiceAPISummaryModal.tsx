import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ModalProps } from '../types';
import { ApiCompositeKey } from '../../../models/reportModel';

/**
 * ServiceAPISummary Props Type
 */
type ServiceAPISummaryProps = ModalProps & {
  serviceSummary: ApiCompositeKey[] | null;
  serviceName: string | null;
};

/**
 * ServiceAPISummary Component
 */
const ServiceAPISummary = ({
  serviceSummary,
  serviceName,
  isOpen,
  setIsOpen,
}: ServiceAPISummaryProps) => {
  const cancelButtonRef = useRef(null);

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
                <>
                  <div className="mt-3 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-xl text-center font-bold leading-6 text-gray-900"
                    >
                      {serviceName}
                    </Dialog.Title>
                    <div className="w-full px-4 py-6 divide-y">
                      {serviceSummary?.map((api) => {
                        const { id, method, pattern } = api;
                        return (
                          <div key={id} className="py-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-600 font-bold">
                                {method}
                              </span>
                              <span>{pattern}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                  </div>
                </>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ServiceAPISummary;
