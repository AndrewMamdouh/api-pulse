import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { CloseIcon } from '../../fa-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  addSelectedFlow,
  removeSelectedFlow,
  addAllToSelectedFlow,
} from '../../slices/flowSlice';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main Layout Component
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [selectedFlowsModal, setSelectedFlowsModal] = useState(false);
  /**
   * Opens Selected Flows Page
   */
  const openSelectedFlowsModal = () => setSelectedFlowsModal(true);
  /**
   * Closes Selected Flow Page
   */
  const closeSelectedFlowsModal = () => setSelectedFlowsModal(false);

  const dispatch = useDispatch();

  const allFlows = useSelector((state: RootState) => state.flow.flows);

  const selectedFlows = useSelector(
    (state: RootState) => state.flow.selectedFlows
  );

  useEffect(() => {
    dispatch(addAllToSelectedFlow());
  }, [allFlows, dispatch]);

  return (
    <>
      {/* <Navbar openSelectedFlowsModal={openSelectedFlowsModal} /> */}
      <div className="flex">
        <Sidebar />

        <div className="w-80vw min-h-screen mx-auto bg-white">
          <Navbar openSelectedFlowsModal={openSelectedFlowsModal} />
          <main className="min-w-full max-h-screen overflow-y-auto pt-[16px]">
            {selectedFlowsModal ? (
              <div className="bg-white flex h-full relative p-4 pt-14">
                <button
                  onClick={closeSelectedFlowsModal}
                  className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xl w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <CloseIcon />
                </button>

                <div className="flex flex-col items-stretch gap-4 w-full">
                  {allFlows.map(({ flowName, id }) =>
                    flowName ? (
                      <label
                        key={flowName}
                        className="capitalize font-semibold flex items-center justify-between gap-1 p-3.5 rounded-md cursor-pointer hover:bg-gray-300"
                      >
                        {flowName}

                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded-sm border-gray-300 focus:ring"
                          checked={selectedFlows.includes(id || '')}
                          onChange={(e) => {
                            id &&
                              dispatch(
                                e.target.checked
                                  ? addSelectedFlow(id)
                                  : removeSelectedFlow(id)
                              );
                          }}
                        />
                      </label>
                    ) : null
                  )}
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
