import React from 'react';
//import { v4 as uuidv4 } from 'uuid';
import KeyEditor from './KeyEditor';
//import { Key } from '../../../models/reportModel';

export type KeyPaneProps = {
  paneValue: string[];
  /**
   *
   */
  setPaneValue: (keys: string[]) => void;
  isEditable?: boolean;
};

/**
 * KeyPane Component
 */
const KeyPane = ({
  paneValue,
  setPaneValue,
  isEditable = true,
}: KeyPaneProps) => {
  /**
   * Add New Key
   */
  const onKeyItemAdd = () => {
    setPaneValue([...paneValue, '']);
  };
  /**
   * Remove Specific Key
   */
  const onKeyItemRemove = (value: string) =>
    setPaneValue(paneValue.filter((key) => key !== value));

  /**
   * Update Specific Key
   */
  const onKeyItemUpdate = (keyValue: string, keyIdx: number) => {
    let newKeys = [...paneValue];
    newKeys[keyIdx] = keyValue;
    setPaneValue(newKeys);
  };

  const renderedList = Array.from(paneValue).map((keyItem, idx) => {
    return (
      <KeyEditor
        key={idx}
        keyItem={keyItem}
        setKeyItem={(keyItem: string) => onKeyItemUpdate(keyItem, idx)}
        onKeyItemRemove={() => onKeyItemRemove(keyItem)}
        isEditable={isEditable}
      />
    );
  });

  return (
    <>
      <div className="">
        {renderedList}
        {isEditable ? (
          <button
            className="px-6 py-1 rounded-md text-blue-500 border border-blue-500 hover:bg-blue-100"
            onClick={onKeyItemAdd}
          >
            Add
          </button>
        ) : null}
      </div>
    </>
  );
};

export default KeyPane;
