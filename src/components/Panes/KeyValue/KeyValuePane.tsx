import React from 'react';
import KeyValueEditor from './KeyValueEditor';
import { KeyValuePair } from '../../../models/reportModel';
import { Pair } from '../../../models';

export type KeyValuePaneProps<T extends string | string[]> = {
  paneValue: Pair<T>;
  /**
   *  setPaneValue Function Type
   */
  setPaneValue: (keyPairs: Pair<T>) => void;
  canDuplicate: boolean;
  isEditable?: boolean;
};

/**
 *  KeyValuePane Component
 */
const KeyValuePane = <T extends string | string[]>({
  paneValue,
  setPaneValue,
  canDuplicate = false,
  isEditable = true,
}: KeyValuePaneProps<T>) => {
  /**
   *  Add New KeyValue Pair
   */
  const onKeyPairAdd = () => {
    const regex = /^key(\d+)$/;
    let keyNumber = 0;
    Object.keys(paneValue).forEach((key) => {
      if (regex.test(key)) {
        const matchedKeyNumber = parseInt(key.match(regex)?.at(1) || '0');
        keyNumber = matchedKeyNumber > keyNumber ? matchedKeyNumber : keyNumber;
      }
    });
    setPaneValue({
      ...paneValue,
      [`key${keyNumber + 1}`]: canDuplicate ? [''] : ('' as any),
    });
  };

  /**
   *  Remove Specific KeyValue Pair
   */
  const onKeyPairRemove = (key: string, valueIdx?: number) => {
    let newPaneValue = { ...paneValue };
    if (valueIdx === undefined) {
      delete newPaneValue[key];
      setPaneValue(newPaneValue);
      return;
    }
    (newPaneValue[key] as string[]) = (newPaneValue[key] as string[]).filter(
      (_, idx) => idx !== valueIdx
    );
    setPaneValue(newPaneValue);
  };

  /**
   *  Update Specific KeyValue Pair
   */
  const onKeyPairUpdate = (
    keyValuePair: KeyValuePair,
    keyIdx: number,
    valueIdx?: number
  ) => {
    let newPaneValue = { ...paneValue };
    const matchedKeyIdx = Object.keys(newPaneValue).findIndex(
      (key) => key === keyValuePair.key
    );

    if (valueIdx === undefined) {
      if (matchedKeyIdx === keyIdx) {
        (newPaneValue[keyValuePair.key] as string) = keyValuePair.value;
        setPaneValue(newPaneValue);
        return;
      }
      delete newPaneValue[Object.keys(newPaneValue)[keyIdx]];
      (newPaneValue[keyValuePair.key] as string) = keyValuePair.value;
      setPaneValue(newPaneValue);
      return;
    }

    if (matchedKeyIdx === keyIdx) {
      (newPaneValue[keyValuePair.key] as string[]) = (
        newPaneValue[keyValuePair.key] as string[]
      ).map((value, idx) => (idx === valueIdx ? keyValuePair.value : value));
      setPaneValue(newPaneValue);
      return;
    }
    delete newPaneValue[Object.keys(newPaneValue)[keyIdx]];
    (newPaneValue[keyValuePair.key] as string[]) = [
      ...((newPaneValue[keyValuePair.key] || []) as string[]),
      keyValuePair.value,
    ];
    setPaneValue(newPaneValue);
    return;
  };

  const renderedList = Object.keys(paneValue)?.map((key, keyIdx) => {
    return Array.isArray(paneValue[key]) ? (
      (paneValue[key] as string[]).map((value, idx) => {
        return (
          <KeyValueEditor
            key={`${key}-${value}-${idx}`}
            keyValuePair={{ key, value }}
            setKeyValuePair={(keyValuePair: KeyValuePair) =>
              onKeyPairUpdate(keyValuePair, keyIdx, idx)
            }
            onKeyValuePairRemove={() => onKeyPairRemove(key, idx)}
            isEditable={isEditable}
          />
        );
      })
    ) : (
      <KeyValueEditor
        key={key}
        keyValuePair={{ key, value: paneValue[key] as string }}
        setKeyValuePair={(keyValuePair: KeyValuePair) =>
          onKeyPairUpdate(keyValuePair, keyIdx)
        }
        onKeyValuePairRemove={() => onKeyPairRemove(key)}
        isEditable={isEditable}
      />
    );
  });

  return (
    <div>
      {renderedList}
      {isEditable ? (
        <button
          className="px-6 py-1 rounded-md text-blue-500 border border-blue-500 hover:bg-blue-100"
          onClick={onKeyPairAdd}
        >
          Add
        </button>
      ) : null}
    </div>
  );
};

export default KeyValuePane;
