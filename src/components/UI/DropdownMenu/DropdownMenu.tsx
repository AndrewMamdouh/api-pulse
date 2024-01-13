import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MenuIcon } from '../../../fa-icons/index';

type DropDownMenuProps = {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /**
   * removeHandler Function Type
   */
  removeHandler: () => void;
  /**
   * editHandler Function Type
   */
  editHandler: () => void;
};

/**
 * DropDownMenu Component
 */
const DropDownMenu = ({
  position = 'bottom-left',
  removeHandler,
  editHandler,
}: DropDownMenuProps) => {
  const positionClassName = {
    'bottom-left': 'top-8 right-0',
    'bottom-right': 'top-8 left-0',
    'top-left': 'bottom-8 right-0',
    'top-right': 'bottom-8 left-0',
  };
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          onClick={(e) => e.stopPropagation()}
          className="bg-transparent p-2 text-white hover:text-white/80"
        >
          <MenuIcon />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute z-20 ${positionClassName[position]} w-24 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none`}
          >
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    } flex justify-center w-full items-center font-semibold rounded-md px-2 py-2 text-sm`}
                    onClick={(e) => {
                      e.stopPropagation();
                      editHandler();
                    }}
                  >
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-red-600 text-white' : 'text-gray-900'
                    } flex justify-center w-full items-center font-semibold rounded-md px-2 py-2 text-sm`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHandler();
                    }}
                  >
                    Remove
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropDownMenu;
