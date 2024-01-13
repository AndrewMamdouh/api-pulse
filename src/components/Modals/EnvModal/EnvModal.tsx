import {
  Fragment,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button, InputGroup } from '../../UI';
import { ModalProps } from '../types';
import { Combobox } from '../../UI';
import { ComboboxOption } from '../../UI/Combobox/Combobox';
import { EnvVariable } from '../../../models';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  addEnv,
  addVariable,
  editEnv,
  editVariable,
} from '../../../slices/envSlice';

/**
 * EnvModal Props Type
 */
export type EnvModalProps = ModalProps & {
  variant: 'var' | 'env';
  isEdit?: boolean;
  isGlobal?: boolean;
};

/**
 * EnvModal Component
 */
const EnvModal = ({
  isOpen,
  setIsOpen,
  variant,
  isEdit,
  isGlobal,
}: EnvModalProps) => {
  const cancelButtonRef = useRef(null);
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ComboboxOption>(
    options[0]
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const initialValRef = useRef<HTMLInputElement>(null);
  const currentValRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { global, local, selectedEnv } = useSelector(
    (state: RootState) => state.env
  );
  const exposedVars = useMemo(
    () =>
      isGlobal
        ? [
            ...global,
            ...(local.find(({ name }) => name === selectedEnv)?.variables ??
              []),
          ]
        : [
            ...(local.find(({ name }) => name === selectedEnv)?.variables ??
              []),
            ...global,
          ],
    [global, isGlobal, local, selectedEnv]
  );

  useLayoutEffect(() => {
    const globalOptions: ComboboxOption[] = global.map((variable) => ({
      id: uuidv4(),
      ...variable,
    }));
    const envOptions: ComboboxOption[] = local.map((env) => ({
      id: uuidv4(),
      ...env,
    }));
    const localOptions: ComboboxOption[] = selectedEnv
      ? (local.find(({ name }) => name === selectedEnv)?.variables || []).map(
          (variable) => ({ id: uuidv4(), ...variable })
        )
      : [];
    setOptions(
      variant === 'env' ? envOptions : isGlobal ? globalOptions : localOptions
    );
  }, [local, global, isGlobal, variant, selectedEnv]);

  useEffect(() => {
    setSelectedOption({ ...options[0] });
  }, [isOpen, options]);

  useLayoutEffect(() => {
    if (selectedOption && isEdit) {
      if (nameRef.current) {
        nameRef.current.value = selectedOption.name;
        if (
          variant === 'var' &&
          initialValRef.current &&
          currentValRef.current
        ) {
          const selectedVariable = exposedVars.find(
            ({ name }) => name === selectedOption.name
          );
          if (selectedVariable) {
            initialValRef.current.value = selectedVariable.value;
            currentValRef.current.value = selectedVariable.current;
          }
        }
      }
    }
  }, [exposedVars, isEdit, local, selectedEnv, selectedOption, variant]);

  const modalHeading = `${isEdit ? 'Edit' : 'Create new'} ${
    variant === 'env' ? 'environment' : 'variable'
  }`;

  /**
   *  Cancel Button Click Handler
   */
  const cancelHandler = () => setIsOpen(false);

  /**
   * Save Button Click Handler
   */
  const saveHandler = () => {
    if (nameRef.current) {
      switch (variant) {
        case 'env':
          const newEnvName = nameRef.current.value;
          if (isEdit) {
            selectedEnv &&
              dispatch(editEnv({ oldEnvName: selectedEnv, newEnvName }));
          } else dispatch(addEnv({ envName: newEnvName }));
          break;
        case 'var':
          if (
            isGlobal !== undefined &&
            initialValRef.current &&
            currentValRef.current
          ) {
            const newVar: EnvVariable = {
              name: nameRef.current.value,
              value: initialValRef.current.value,
              current: currentValRef.current.value,
            };
            if (isEdit) {
              const selectedVar = exposedVars.find(
                ({ name }) => name === selectedOption?.name
              );
              selectedVar &&
                dispatch(
                  editVariable({
                    isGlobal,
                    oldVar: selectedVar,
                    newVar,
                    envName: selectedEnv,
                  })
                );
            } else
              dispatch(
                addVariable({
                  isGlobal,
                  variable: newVar,
                  envName: selectedEnv,
                })
              );
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
                      label={`Choose ${
                        variant === 'env' ? 'an environment' : 'a variable'
                      }`}
                    />
                  ) : null}
                  {variant === 'env' ? (
                    <InputGroup ref={nameRef} required>
                      Environment Name
                    </InputGroup>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <InputGroup ref={nameRef} required>
                        Variable Name
                      </InputGroup>
                      <InputGroup ref={initialValRef} required>
                        Variable Initial Value
                      </InputGroup>
                      <InputGroup ref={currentValRef} required>
                        Variable Current Value
                      </InputGroup>
                    </div>
                  )}
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

export default EnvModal;
