import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ApiSample } from '../../../models';
import { generateCurlCommand } from '../../../utils/helpers';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckIcon, CopyIcon } from '../../../fa-icons';
import { ModalProps } from '../types';

/**
 * CurlCommandModal Props Type
 */
type CurlCommandModalProps = ModalProps & {
  apiSample?: ApiSample;
};

/**
 * CurlCommandModal Component
 */
const CurlCommandModal = ({
  apiSample,
  isOpen,
  setIsOpen,
}: CurlCommandModalProps) => {
  const cancelButtonRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timeout: any;
    if (isCopied) {
      timeout = setTimeout(() => setIsCopied(false), 1000);
    } else clearTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  if (!apiSample) return null;

  const beautifiedCurlCommand = generateCurlCommand(apiSample, true);
  const curlCommand = generateCurlCommand(apiSample);

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
                <div className="relative">
                  <SyntaxHighlighter
                    style={vs2015}
                    customStyle={{
                      borderRadius: 4,
                      padding: 16,
                      scrollbarColor: '#FFF transparent',
                      scrollbarWidth: 'thin',
                    }}
                  >
                    {beautifiedCurlCommand}
                  </SyntaxHighlighter>
                  <div className="absolute top-2 right-2">
                    <CopyToClipboard
                      text={curlCommand}
                      onCopy={() => setIsCopied(true)}
                    >
                      <button
                        disabled={isCopied}
                        className={`flex justify-center items-center ${
                          isCopied ? 'text-green-600' : 'text-gray-300'
                        } text-base p-1.5 rounded-sm outline outline-1 ${
                          isCopied ? 'outline-green-600' : 'outline-transparent'
                        } hover:${
                          isCopied ? 'outline-green-600' : 'outline-blue-500'
                        }`}
                      >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </CopyToClipboard>
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

export default CurlCommandModal;
