import { Fragment, useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button, InputGroup } from '../../UI';
import { ModalProps } from '../types';
import { Combobox } from '../../UI';
import { ComboboxOption } from '../../UI/Combobox/Combobox';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { AddBaseUrl, EditBaseUrl } from '../../../slices/baseUrlSlice';
import { toast } from 'react-hot-toast';

/**
 * BaseUrlModal Props Type
 */
export type BaseUrlModalProps = ModalProps & {
  isEdit?: boolean;
};

/**
 * BaseUrlModal Component
 */
const BaseUrlModal = ({ isOpen, setIsOpen, isEdit }: BaseUrlModalProps) => {
  const cancelButtonRef = useRef(null);
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ComboboxOption>(
    options[0]
  );
  const baseUrlRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { urls } = useSelector((state: RootState) => state.baseUrl);

  useLayoutEffect(() => {
    const urlOptions: ComboboxOption[] = urls.map((url) => ({
      id: uuidv4(),
      name: url,
    }));
    setOptions(urlOptions);
  }, [urls]);

  useEffect(() => {
    setSelectedOption({ ...options[0] });
  }, [isOpen, options]);

  useLayoutEffect(() => {
    if (selectedOption && isEdit && baseUrlRef.current) {
      baseUrlRef.current.value = selectedOption.name;
    }
  }, [isEdit, selectedOption]);

  const modalHeading = `${isEdit ? 'Edit Base URL' : 'Add New Base URL'}`;

  /**
   *  Cancel Button Click Handler
   */
  const cancelHandler = () => setIsOpen(false);

  /**
   * Save Button Click Handler
   */
  const saveHandler = () => {
    if (baseUrlRef.current) {
      const newBaseUrl = baseUrlRef.current.value;
      try {
        const url = new URL(newBaseUrl);
        if (isEdit && selectedOption) {
          dispatch(
            EditBaseUrl({
              oldBaseUrl: selectedOption.name,
              newBaseUrl: url.href,
            })
          );
        } else dispatch(AddBaseUrl({ newUrl: url.href }));
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message);
        }
      }
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <Dialog.Title className="mt-0 mb-5 text-xl font-semibold text-center">
                  {modalHeading}
                </Dialog.Title>
                <div className="flex flex-col gap-4">
                  {isEdit ? (
                    <Combobox
                      options={options}
                      selectedOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                      label="Choose Base URL"
                    />
                  ) : null}
                  <InputGroup ref={baseUrlRef} required>
                    Base URL
                  </InputGroup>
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

export default BaseUrlModal;
