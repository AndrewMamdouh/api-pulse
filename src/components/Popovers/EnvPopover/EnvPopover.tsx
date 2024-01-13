import { Popover, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  EditIcon,
  EnvPopoverIcon,
  PlusIcon,
  TrashIcon,
} from '../../../fa-icons';
import { Fragment, useMemo, useState } from 'react';
import { BaseUrlModal, EnvModal } from '../../Modals';
import {
  EnvsTableData,
  envVariablesTableColumns,
  envsTableColumns,
  baseUrlsTableColumns,
  BaseUrlTableData,
  baseUrlsTableHeadingClassNames,
} from './makeData';
import { Button, Table } from '../../UI';
import { Row } from '@tanstack/react-table';
import { DangerAlert } from '../../Alerts';
import { DangerAlertProps } from '../../Alerts/DangerAlert/DangerAlert';
import { useDispatch, useSelector } from 'react-redux';
import { removeEnv, removeVariable, selectEnv } from '../../../slices/envSlice';
import { removeBaseUrl, selectBaseUrl } from '../../../slices/baseUrlSlice';
import { RootState } from '../../../store';

/**
 * EnvPopover Component
 */
const EnvPopover = () => {
  const [removeAlert, setRemoveAlert] = useState<
    Omit<DangerAlertProps, 'setIsOpen'>
  >({
    isOpen: false,
    body: '',
    heading: '',
  });
  const [envModal, setEnvModal] = useState<{
    variant: 'var' | 'env';
    isEdit?: boolean;
    isGlobal?: boolean;
    isOpen: boolean;
  }>({ variant: 'var', isOpen: false });
  const [baseUrlModal, setBaseUrlModal] = useState<{
    isEdit?: boolean;
    isOpen: boolean;
  }>({ isOpen: false });

  const dispatch = useDispatch();
  const { global, local, selectedEnv } = useSelector(
    (state: RootState) => state.env
  );
  const { urls, selectedUrl } = useSelector(
    (state: RootState) => state.baseUrl
  );

  /**
   * Control Remove Alert
   */
  const setIsRemoveAlertOpen = (isOpen: boolean) =>
    setRemoveAlert((prev) => ({ ...prev, isOpen }));

  /**
   * Control Env Modal
   */
  const setIsEnvModalOpen = (isOpen: boolean) =>
    setEnvModal((prev) => ({ ...prev, isOpen }));

  /**
   * Control BaseUrl Modal
   */
  const setIsBaseUrlModalOpen = (isOpen: boolean) =>
    setBaseUrlModal((prev) => ({ ...prev, isOpen }));

  /**
   * Globals Add Button Click Handler
   */
  const globalsAddHandler = () => {
    setEnvModal({
      variant: 'var',
      isGlobal: true,
      isOpen: true,
    });
  };

  /**
   * Globals Edit Button Click Handler
   */
  const globalsEditHandler = () => {
    setEnvModal({
      variant: 'var',
      isGlobal: true,
      isEdit: true,
      isOpen: true,
    });
  };

  /**
   * Envs Add Button Click Handler
   */
  const envsAddHandler = () => {
    setEnvModal({
      variant: 'env',
      isOpen: true,
    });
  };

  /**
   * Envs Edit Button Click Handler
   */
  const envsEditHandler = () => {
    setEnvModal({
      variant: 'env',
      isEdit: true,
      isOpen: true,
    });
  };

  /**
   * Locals Add Button Click Handler
   */
  const localsAddHandler = () => {
    setEnvModal({
      variant: 'var',
      isOpen: true,
      isGlobal: false,
    });
  };

  /**
   * Locals Edit Button Click Handler
   */
  const localsEditHandler = () => {
    setEnvModal({
      variant: 'var',
      isEdit: true,
      isOpen: true,
      isGlobal: false,
    });
  };

  /**
   * BaseUrl Add Button Click Handler
   */
  const baseUrlAddHandler = () => {
    setBaseUrlModal({
      isOpen: true,
    });
  };

  /**
   * BaseUrl Edit Button Click Handler
   */
  const baseUrlEditHandler = () => {
    setBaseUrlModal({
      isEdit: true,
      isOpen: true,
    });
  };

  const globalsTableData = useMemo(
    () =>
      global.map((globalVar) => ({
        ...globalVar,
        className: 'text-center',
        action: (
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              iconOnly={true}
              onClick={() =>
                setRemoveAlert({
                  isOpen: true,
                  heading: 'Remove a variable',
                  body: `Are you sure you want to remove "${globalVar.name}" variable? This action cannot be undone.`,
                  /**
                   * Remove Alert Action Button Click Handler (For Global Variable)
                   */
                  actionFn: () =>
                    dispatch(
                      removeVariable({
                        isGlobal: true,
                        varName: globalVar.name,
                      })
                    ), // removeVariable(true, globalVar.name),
                })
              }
            >
              <TrashIcon />
            </Button>
          </div>
        ),
      })),
    [dispatch, global]
  );
  const globalsTableColumns = useMemo(() => envVariablesTableColumns, []);

  const environmentsTableData = useMemo(
    () =>
      local.map(({ name, variables }) => ({
        ...(name === selectedEnv && {
          selected: (
            <span className="text-xl text-blue-600">
              <CheckCircleIcon />
            </span>
          ),
        }),
        name,
        className: 'text-center',
        varsCount: variables.length,
        action: (
          <div className="flex justify-end">
            <Button
              className="ml-auto"
              variant="secondary"
              size="sm"
              iconOnly={true}
              onClick={(e) => {
                e.stopPropagation();
                setRemoveAlert({
                  isOpen: true,
                  heading: 'Remove an environment',
                  body: `Are you sure you want to remove "${name}" environment? This action cannot be undone.`,
                  /**
                   * Remove Alert Action Button Click Handler (For Env)
                   */
                  actionFn: () => dispatch(removeEnv({ envName: name })), //removeEnv(name),
                });
              }}
            >
              <TrashIcon />
            </Button>
          </div>
        ),
      })),
    [dispatch, local, selectedEnv]
  );
  const environmentsTableColumns = useMemo(() => envsTableColumns, []);

  const localsTableData = useMemo(
    () =>
      local
        .find(({ name }) => name === selectedEnv)
        ?.variables.map((localVar) => ({
          ...localVar,
          className: 'text-center',
          action: (
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                iconOnly={true}
                onClick={() =>
                  setRemoveAlert({
                    isOpen: true,
                    heading: 'Remove a variable',
                    body: `Are you sure you want to remove "${localVar.name}" variable? This action cannot be undone.`,
                    /**
                     * Remove Alert Action Button Click Handler (For Local Variable)
                     */
                    actionFn: () =>
                      dispatch(
                        removeVariable({
                          isGlobal: false,
                          varName: localVar.name,
                          envName: selectedEnv,
                        })
                      ),
                  })
                }
              >
                <TrashIcon />
              </Button>
            </div>
          ),
        })) || [],
    [dispatch, local, selectedEnv]
  );
  const localsTableColumns = useMemo(() => envVariablesTableColumns, []);

  const baseUrlTableData = useMemo<BaseUrlTableData[]>(
    () =>
      urls.map((url) => ({
        selected: (
          <span className="text-xl text-blue-600">
            {url === selectedUrl ? (
              <CheckCircleIcon />
            ) : (
              <div className="w-5 h-5" />
            )}
          </span>
        ),
        url,
        action: (
          <div className="flex justify-end">
            <Button
              className="ml-auto"
              variant="secondary"
              size="sm"
              iconOnly={true}
              onClick={(e) => {
                e.stopPropagation();
                setRemoveAlert({
                  isOpen: true,
                  heading: 'Remove Base URL',
                  body: `Are you sure you want to remove "${url}" url? This action cannot be undone.`,
                  /**
                   * Remove Alert Action Button Click Handler (For Env)
                   */
                  actionFn: () => dispatch(removeBaseUrl({ baseUrl: url })),
                });
              }}
            >
              <TrashIcon />
            </Button>
          </div>
        ),
      })),
    [dispatch, selectedUrl, urls]
  );
  const baseUrlTableColumns = useMemo(() => baseUrlsTableColumns, []);

  /**
   * Env Table Row Click Handler
   */
  const envTableRowClickHandler = (row: Row<EnvsTableData>) =>
    dispatch(selectEnv({ envName: row.original.name }));

  /**
   * BaseUrl Table Row Click Handler
   */
  const baseUrlTableRowClickHandler = (row: Row<BaseUrlTableData>) =>
    dispatch(selectBaseUrl({ baseUrl: row.original.url }));

  return (
    <div>
      <Popover className="relative">
        {({ open }) => {
          return (
            <>
              <Popover.Button
                className="text-lg" /*onClick={() => setIsPopoverOpen(open)}*/
              >
                <EnvPopoverIcon />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 w-screen max-w-md">
                  <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black/5 bg-white border-2 border-blue-500">
                    <div className="flex flex-col">
                      <div>
                        <div className="bg-blue-500 text-white px-2 flex items-center justify-between gap-6">
                          <h3 className="font-semibold">Base URL</h3>
                          <div className="flex items-center">
                            {urls.length ? (
                              <button
                                onClick={baseUrlEditHandler}
                                className="p-2 text-white hover:text-gray-300"
                              >
                                <EditIcon />
                              </button>
                            ) : null}
                            <button
                              onClick={baseUrlAddHandler}
                              className="p-2 text-white hover:text-gray-300"
                            >
                              <PlusIcon />
                            </button>
                          </div>
                        </div>
                        <div className="bg-white">
                          {urls.length ? (
                            <Table
                              data={baseUrlTableData}
                              columns={baseUrlTableColumns}
                              rowClickHandler={baseUrlTableRowClickHandler}
                              headingClassNames={baseUrlsTableHeadingClassNames}
                              hasHoverEffect
                              rowHoverClassName="hover:bg-gray-100 hover:cursor-pointer"
                              spacing="sm"
                              bordered
                            />
                          ) : (
                            <h2 className="px-4 py-1 mb-3 text-center text-base text-gray-500">
                              This URL will be used to send all api requests. If
                              not there the url associated with each api will be
                              used instead.
                            </h2>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="bg-blue-500 text-white px-2 flex items-center justify-between gap-6">
                          <h3 className="font-semibold">Globals</h3>
                          <div className="flex items-center">
                            {global.length ? (
                              <button
                                onClick={globalsEditHandler}
                                className="p-2 text-white hover:text-gray-300"
                              >
                                <EditIcon />
                              </button>
                            ) : null}
                            <button
                              onClick={globalsAddHandler}
                              className="p-2 text-white hover:text-gray-300"
                            >
                              <PlusIcon />
                            </button>
                          </div>
                        </div>
                        <div className="bg-white">
                          {global.length ? (
                            <Table
                              data={globalsTableData}
                              columns={globalsTableColumns}
                              spacing="sm"
                              bordered
                            />
                          ) : (
                            <h2 className="px-4 py-1 mb-3 text-center text-base text-gray-500">
                              You Don't Have Any Global Variables Yet.
                            </h2>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="bg-blue-500 text-white px-2 flex items-center justify-between gap-6">
                          <h3 className="font-semibold">Environments</h3>
                          <div className="flex items-center">
                            {local.length ? (
                              <button
                                onClick={envsEditHandler}
                                className="p-2 text-white hover:text-gray-300"
                              >
                                <EditIcon />
                              </button>
                            ) : null}
                            <button
                              onClick={envsAddHandler}
                              className="p-2 text-white hover:text-gray-300"
                            >
                              <PlusIcon />
                            </button>
                          </div>
                        </div>
                        <div className="bg-white">
                          {local.length ? (
                            <Table
                              data={environmentsTableData}
                              columns={environmentsTableColumns}
                              rowClickHandler={envTableRowClickHandler}
                              hasHoverEffect
                              rowHoverClassName="hover:bg-gray-100 hover:cursor-pointer"
                              spacing="sm"
                              bordered
                            />
                          ) : (
                            <h2 className="px-4 py-1 mb-3 text-center text-base text-gray-500">
                              You Don't Have Any Environments Yet.
                            </h2>
                          )}
                        </div>
                      </div>
                      {local.length ? (
                        <div>
                          <div className="bg-blue-500 text-white px-2 flex items-center justify-between gap-6">
                            <h3 className="font-semibold">Local Variables</h3>
                            <div className="flex items-center">
                              {localsTableData.length ? (
                                <button
                                  onClick={localsEditHandler}
                                  className="p-2 text-white hover:text-gray-300"
                                >
                                  <EditIcon />
                                </button>
                              ) : null}
                              <button
                                onClick={localsAddHandler}
                                className="p-2 text-white hover:text-gray-300"
                              >
                                <PlusIcon />
                              </button>
                            </div>
                          </div>
                          <div className="bg-white">
                            {localsTableData.length ? (
                              <Table
                                data={localsTableData}
                                columns={localsTableColumns}
                                spacing="sm"
                                bordered
                              />
                            ) : (
                              <h2 className="px-4 py-1 mb-3 text-center text-base text-gray-500">
                                This Environment Doesn't Contain Any Variables
                                Yet.
                              </h2>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
      <EnvModal setIsOpen={setIsEnvModalOpen} {...envModal} />
      <BaseUrlModal setIsOpen={setIsBaseUrlModalOpen} {...baseUrlModal} />
      <DangerAlert
        isOpen={removeAlert.isOpen}
        setIsOpen={setIsRemoveAlertOpen}
        heading={removeAlert.heading}
        body={removeAlert.body}
        actionFn={removeAlert.actionFn}
      />
    </div>
  );
};

export default EnvPopover;
