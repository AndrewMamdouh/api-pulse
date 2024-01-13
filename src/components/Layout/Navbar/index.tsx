import { EnvPopover } from '../../Popovers';

export type NavbarProps = {
  /**
   * openSelectedFlows Function Type
   */
  openSelectedFlowsModal?: () => void;
};

/**
 * Navbar Component
 */
const Navbar = ({ openSelectedFlowsModal }: NavbarProps) => {
  return (
    <div
      className="inset-x-0 bg-white"
      style={{ zIndex: '10', maxWidth: '78vw' }}
    >
      <div className=" flex border-b border-gray-300">
        <div className="flex items-stretch justify-between max-w-7xl mx-auto flex-1">
          <div className="flex gap-4">
            {/* <span className="py-2.5 px-4 text-md font-semibold border-b-4 border-blue-500">
              Collected Samples
            </span> */}
            <button
              className="py-2.5 px-4 text-md font-semibold border-b-4 border-blue-500"
              onClick={openSelectedFlowsModal}
            >
              Selected Flows
            </button>
          </div>
          <select className="no-env">
            <option>No Environment</option>
          </select>
        </div>
        <div className="flex justify-center items-center p-4 transform-none">
          <EnvPopover />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
