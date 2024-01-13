import React, { FocusEvent, ChangeEvent, useState } from 'react';

type KeyEditorProps = {
  keyItem: string;
  /**
   *  setKeyItem Function Type
   */
  setKeyItem: (keyItem: string) => void;
  /**
   *  onKeyItemRemove Function Type
   */
  onKeyItemRemove: () => void;
  isEditable?: boolean;
};

/**
 *  KeyEditor Component
 */
const KeyEditor = ({
  keyItem = '',
  setKeyItem,
  onKeyItemRemove,
  isEditable = true,
}: KeyEditorProps) => {
  const [keyValue, setKeyValue] = useState(keyItem);

  /**
   *  Change Handler For Text Input
   */
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyValue(e.target.value);
  };

  /**
   * Handles input blur and trigger an update action immediately without waiting for a timeout
   */
  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (keyValue !== keyItem) setKeyItem(keyValue);
  };

  return (
    <>
      <div className="flex mb-3">
        <input
          className="px-4 py-1.5 w-full border border-gray-300 rounded-md  hover:border-blue-500 focus:outline-blue-500"
          placeholder="Key"
          name="key"
          value={keyValue}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          readOnly={!isEditable}
          disabled={!isEditable}
        />
        {isEditable ? (
          <button
            className="ml-4 px-4 rounded-md text-blue-500 border border-blue-300 hover:bg-blue-100"
            onClick={onKeyItemRemove}
          >
            Remove
          </button>
        ) : null}
      </div>
    </>
  );
};

export default KeyEditor;
