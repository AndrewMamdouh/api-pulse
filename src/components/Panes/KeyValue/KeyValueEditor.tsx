import React, { FocusEvent, ChangeEvent, useState, useEffect } from 'react';
import { KeyValuePair } from '../../../models/reportModel';

type KeyValueEditorProps = {
  keyValuePair: KeyValuePair;
  /**
   *  setKeyValuePair Function Type
   */
  setKeyValuePair: (keyValuePair: KeyValuePair) => void;
  /**
   *  onKeyValuePairRemove Function Type
   */
  onKeyValuePairRemove: () => void;
  isEditable?: boolean;
};

/**
 *  KeyValueEditor Component
 */
const KeyValueEditor = ({
  keyValuePair,
  setKeyValuePair,
  onKeyValuePairRemove,
  isEditable = true,
}: KeyValueEditorProps) => {
  const [keyValue, setKeyValue] = useState(keyValuePair);

  useEffect(() => {
    setKeyValue(keyValuePair);
  }, [keyValuePair]);
  /**
   * Handles input change and trigger an update action after a timeout using useDebounce Hook
   */
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newKeyPair: KeyValuePair = {
      ...keyValuePair,
      [e.target.name]: e.target.value,
    };
    setKeyValue(newKeyPair);
  };

  /**
   * Handles input blur and trigger an update action immediately without waiting for a timeout
   */
  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (
      keyValuePair.key !== keyValue.key ||
      keyValuePair.value !== keyValue.value
    ) {
      const newKeyPair: KeyValuePair = {
        ...keyValuePair,
        [e.target.name]: e.target.value,
      };
      setKeyValuePair(newKeyPair);
    }
  };

  return (
    <>
      <div className="flex mb-3">
        <input
          className="px-4 py-1.5 w-full border border-gray-300 rounded-md  hover:border-blue-500 focus:outline-blue-500"
          placeholder="Key"
          name="key"
          value={keyValue.key}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          readOnly={!isEditable}
          disabled={!isEditable}
        />
        <input
          className="ml-3 px-4 py-1.5 w-full border border-gray-300 rounded-md hover:border-blue-500 focus:outline-blue-500"
          placeholder="Value"
          name="value"
          value={keyValue.value}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          readOnly={!isEditable}
          disabled={!isEditable}
        />
        {isEditable ? (
          <button
            className="ml-4 px-4 rounded-md text-blue-500 border border-blue-300 hover:bg-blue-100"
            onClick={onKeyValuePairRemove}
          >
            Remove
          </button>
        ) : null}
      </div>
    </>
  );
};

export default KeyValueEditor;
