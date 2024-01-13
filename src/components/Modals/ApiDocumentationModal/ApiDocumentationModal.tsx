import { Fragment, useEffect, useRef, useState, ChangeEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ApiDocumentation } from '../../../models';
import { Button, InputGroup } from '../../UI';
import { convertCamelCaseToSpacedUppercase } from '../../../utils/helpers';
import { updateApiDocumentation } from '../../../api/getServices';
import { toast } from 'react-hot-toast';
import { useLocalStorage } from '../../../hooks';
import { safeJSONParse } from '../../../utils/helpers';
import { ModalProps } from '../types';

/**
 * ApiDocumentationModal Props Type
 */
type ApiDocumentationModalProps = ModalProps & {
  apiDocumentation?: ApiDocumentation;
};

/**
 * ApiDocumentationModal Component
 */
const ApiDocumentationModal = ({
  apiDocumentation,
  isOpen,
  setIsOpen,
}: ApiDocumentationModalProps) => {
  const cancelButtonRef = useRef(null);
  const [savedApiDocumentation, setSavedApiDocumentation] =
    useState(apiDocumentation);
  const [isEditable, setIsEditable] = useState(false);
  const { getItem, setItem } = useLocalStorage();

  /**
   * Handle Input Change
   */
  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setSavedApiDocumentation(
      (prev) => prev && { ...prev, [e.target.name]: e.target.value }
    );

  useEffect(() => {
    setSavedApiDocumentation(apiDocumentation);
    setIsEditable(false);
  }, [apiDocumentation]);

  if (!savedApiDocumentation) return null;

  /**
   *  Close Button Click Handler
   */
  const closeHandler = () => setIsOpen(false);

  /**
   *  Cancel Button Click Handler
   */
  const cancelHandler = () => {
    setSavedApiDocumentation(apiDocumentation);
    setIsEditable(false);
  };

  /**
   *  Edit Button Click Handler
   */
  const editHandler = () => {
    setIsOpen(true);
    setIsEditable(true);
  };

  /**
   *  Save Button Click Handler
   */
  const saveHandler = async () => {
    const result = await updateApiDocumentation(
      savedApiDocumentation.compositeKeyId || '',
      savedApiDocumentation
    );
    if (result) {
      const apiDocumentations: ApiDocumentation[] = safeJSONParse(
        getItem('apiDocumentation'),
        false
      );
      if (apiDocumentations.length) {
        const newApiDocumentation = apiDocumentations.map((doc) =>
          doc.compositeKeyId === savedApiDocumentation.compositeKeyId
            ? savedApiDocumentation
            : doc
        );
        setItem('apiDocumentation', JSON.stringify(newApiDocumentation));
      }
      toast.success('Api Documentation Updated Successfully!');
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
                <div className="flex flex-col gap-4">
                  {Object.keys(savedApiDocumentation)
                    .filter(
                      (key) => !['javaScripts', 'compositeKeyId'].includes(key)
                    )
                    .map((key) => (
                      <InputGroup
                        key={key}
                        disabled={!isEditable}
                        readOnly={!isEditable}
                        name={key}
                        onChange={inputChangeHandler}
                        value={
                          (savedApiDocumentation[
                            key as keyof ApiDocumentation
                          ] || '') as string
                        }
                      >
                        {convertCamelCaseToSpacedUppercase(key)}
                      </InputGroup>
                    ))}
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <Button
                    size="xl"
                    variant="secondary"
                    onClick={isEditable ? cancelHandler : closeHandler}
                  >
                    {isEditable ? 'Cancel' : 'Close'}
                  </Button>
                  <Button
                    size="xl"
                    onClick={isEditable ? saveHandler : editHandler}
                  >
                    {isEditable ? 'Save' : 'Edit'}
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

export default ApiDocumentationModal;
