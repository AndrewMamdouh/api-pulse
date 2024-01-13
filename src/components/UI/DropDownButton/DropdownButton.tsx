import React, { useState } from 'react';

export type ButtonMenu = {
  label: string;
  id: string;
};

type DropdownButtonProps = {
  buttonText: String;
  buttonMenu: ButtonMenu[];
  /**
   *
   */
  onItemClick: (item: ButtonMenu) => void;
};

/**
 *
 */
const DropdownButton = (props: DropdownButtonProps) => {
  const { buttonText, buttonMenu, onItemClick } = props;

  const [showMenu, setShowMenu] = useState(false);

  /**
   *
   */
  const onClickHandler = (element: ButtonMenu) => () => {
    onItemClick(element);
    setShowMenu(false);
  };

  return (
    <React.Fragment>
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-black"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={() => setShowMenu(!showMenu)}
          >
            {buttonText}
            <svg
              className="-mr-1 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        {showMenu && (
          <div
            className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              {buttonMenu.map((button: ButtonMenu) => {
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                return (
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <a
                    key={button.id}
                    onClick={onClickHandler(button)}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
                    role="menuitem"
                    id="menu-item-0"
                  >
                    {button.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default DropdownButton;
