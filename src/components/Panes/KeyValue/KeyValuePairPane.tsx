import React from 'react';
import KeyValueEditor from './KeyValueEditor';
import { KeyValuePair } from '../../../models/reportModel';

export type KeyValuePairPaneProps = {
  paneValue: KeyValuePair[];
  /**
   *  setPaneValue Function Type
   */
  setPaneValue: (keyPairs: KeyValuePair[]) => void;
  isEditable?: boolean;
};

/**
 *  KeyValuePairPane Component
 */
const KeyValuePairPane = ({
  paneValue,
  setPaneValue,
  isEditable = true,
}: KeyValuePairPaneProps) => {
  /**
   *  Add New KeyValuePair
   */
  const onKeyValuePairAdd = () => {
    const regex = /^key(\d+)$/;
    let keyNumber = 0;
    paneValue.forEach(({ key }) => {
      if (regex.test(key)) {
        const matchedKeyNumber = parseInt(key.match(regex)?.at(1) || '0');
        keyNumber = matchedKeyNumber > keyNumber ? matchedKeyNumber : keyNumber;
      }
    });
    setPaneValue([...paneValue, { key: `key${keyNumber + 1}`, value: '' }]);
  };

  /**
   *  Remove Specific KeyValuePair
   */
  const onKeyValuePairRemove = (pairIdx: number) =>
    setPaneValue(paneValue.filter((_, idx) => idx !== pairIdx));

  /**
   *  Update Specific KeyValuePair
   */
  const onKeyValuePairUpdate = (keyValuePair: KeyValuePair, keyIdx: number) => {
    let newPaneValue = [...paneValue];
    newPaneValue[keyIdx] = keyValuePair;
    setPaneValue(newPaneValue);
  };

  const renderedList = paneValue.map((pair, pairIdx) => (
    <KeyValueEditor
      key={`${pair.key}-${pairIdx}`}
      keyValuePair={pair}
      setKeyValuePair={(keyValuePair: KeyValuePair) =>
        onKeyValuePairUpdate(keyValuePair, pairIdx)
      }
      onKeyValuePairRemove={() => onKeyValuePairRemove(pairIdx)}
      isEditable={isEditable}
    />
  ));

  return (
    <div>
      {renderedList}
      {isEditable ? (
        <button
          className="px-6 py-1 rounded-md text-blue-500 border border-blue-500 hover:bg-blue-100"
          onClick={onKeyValuePairAdd}
        >
          Add
        </button>
      ) : null}
    </div>
  );
};

export default KeyValuePairPane;
