import { Fragment, useState } from 'react';
import { Combobox as HeadlessUICombobox, Transition } from '@headlessui/react';
import { CheckIcon, CaretDownIcon } from '../../../fa-icons';

export type ComboboxOption = {
  id: string;
  name: string;
};

export type ComboboxProps = {
  label?: string;
  options: ComboboxOption[];
  selectedOption?: ComboboxOption;
  /**
   * setSelectedOption Function Type
   */
  setSelectedOption: (option: ComboboxOption) => void;
};

/**
 * Combobox Component
 */
const Combobox = ({
  label,
  options,
  selectedOption,
  setSelectedOption,
}: ComboboxProps) => {
  const [query, setQuery] = useState('');

  const filteredOptions = query
    ? options.filter(({ name }) =>
        name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )
    : options;

  return (
    <div>
      <HeadlessUICombobox value={selectedOption} onChange={setSelectedOption}>
        {label ? (
          <HeadlessUICombobox.Label className="font-medium leading-6 text-gray-900">
            {label}
          </HeadlessUICombobox.Label>
        ) : null}
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus-within:ring-2 focus-within:ring-blue-500 bg-white text-left shadow-sm ring-1 ring-gray-300 sm:text-sm">
            <HeadlessUICombobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 outline-none focus:ring-0 focus-visible:ring-0"
              displayValue={(option: ComboboxOption) => option.name}
              onChange={(e) => setQuery(e.target.value)}
            />
            <HeadlessUICombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <CaretDownIcon />
            </HeadlessUICombobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <HeadlessUICombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {!filteredOptions.length && query ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <HeadlessUICombobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-200 text-black' : 'text-gray-800'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.name}
                        </span>
                        {selected ? (
                          <span className="text-blue-500 text-lg absolute inset-y-0 left-0 flex items-center pl-3">
                            <CheckIcon />
                          </span>
                        ) : null}
                      </>
                    )}
                  </HeadlessUICombobox.Option>
                ))
              )}
            </HeadlessUICombobox.Options>
          </Transition>
        </div>
      </HeadlessUICombobox>
    </div>
  );
};

export default Combobox;
