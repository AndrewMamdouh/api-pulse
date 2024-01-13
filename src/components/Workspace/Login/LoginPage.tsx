import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast, Toaster } from 'react-hot-toast';
import AuthContext from '../../../context/AuthContext';
import { useLocalStorage } from '../../../hooks';
import { Button, InputGroup } from '../../UI';
import { getApiOwners } from '../../../api/getServices';
import { ApiOwner } from '../../../models';
import { Listbox, Transition } from '@headlessui/react';
import { CaretDownIcon, CheckIcon } from '../../../fa-icons';
/**
 *  LoginPage Component
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [pageIdx, setPageIdx] = useState(0);
  const [apiOwners, setApiOwners] = useState<ApiOwner[] | null>(null);
  const [teamName, setTeamName] = useState<string>('Team');
  const [envName, setEnvName] = useState<string>('Environment');
  const apiKeyRef = useRef<HTMLInputElement>(null);
  const partnerIdRef = useRef<HTMLInputElement>(null);
  const { setItem } = useLocalStorage();
  const { isAuthenticated, checkAuthenticity } = useContext(AuthContext);

  useEffect(() => {
    isAuthenticated && navigate('/collections');
    isAuthenticated ?? checkAuthenticity();
  }, [checkAuthenticity, isAuthenticated, navigate]);

  /**
   *  Next Handler
   */
  const nextHandler = async () => {
    if (apiKeyRef.current && partnerIdRef.current) {
      setItem('API_Key', apiKeyRef.current.value);
      setItem('Partner_ID', partnerIdRef.current.value);
      const res = await checkAuthenticity();
      if (res?.status === 200) {
        setApiOwners(await getApiOwners());
        setPageIdx(1);
      } else toast.error('Invalid credentials!');
    }
  };

  /**
   *  Sign In Handler
   */
  const signInHandler = async () => {
    if (teamName && envName) {
      setItem('Team_Name', teamName);
      setItem('ENV_Name', envName);
      await checkAuthenticity();
      toast.success('You are successfully logged in');
      navigate('/collections');
    }
  };
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {pageIdx
              ? 'Choose Your Team & Environment'
              : 'Enter Your Credentials'}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {pageIdx ? (
            <div className="space-y-6">
              <Listbox value={teamName} onChange={setTeamName}>
                <div className="relative mt-1">
                  <Listbox.Button className="group relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm">
                    <span className="block truncate">{teamName}</span>
                    <span className="group-focus:text-blue-500 group-hover:text-blue-500 text-gray-300 pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <CaretDownIcon />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {Array.from(
                        new Set(apiOwners?.map(({ team }) => team))
                      ).map((team, teamIdx) => (
                        <Listbox.Option
                          key={teamIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-blue-200 text-black'
                                : 'text-gray-800'
                            }`
                          }
                          value={team}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {team}
                              </span>
                              {selected ? (
                                <span className="text-blue-500 text-lg absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              <Listbox value={envName} onChange={setEnvName}>
                <div className="relative mt-1">
                  <Listbox.Button className="group relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm">
                    <span className="block truncate">{envName}</span>
                    <span className="group-focus:text-blue-500 group-hover:text-blue-500 text-gray-300 pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <CaretDownIcon />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {Array.from(
                        new Set(
                          apiOwners
                            ?.filter(({ team }) => team === teamName)
                            .map(({ env }) => env)
                        )
                      ).map((env, envIdx) => (
                        <Listbox.Option
                          key={envIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-blue-200 text-black'
                                : 'text-gray-800'
                            }`
                          }
                          value={env}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {env}
                              </span>
                              {selected ? (
                                <span className="text-blue-500 text-lg absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              <Button
                onClick={signInHandler}
                className="flex w-full flex-1 justify-center"
              >
                Sign In
              </Button>
            </div>
          ) : (
            <form className="space-y-6">
              <InputGroup ref={partnerIdRef} required={true}>
                Partner ID
              </InputGroup>
              <InputGroup ref={apiKeyRef} required={true}>
                API Key
              </InputGroup>
              <div>
                <Button
                  onClick={nextHandler}
                  className="flex w-full flex-1 justify-center"
                >
                  Next
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
