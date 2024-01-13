import React, { useRef, useEffect, useMemo } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { safeJSONParse } from '../../../utils/helpers';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { classname } from '@uiw/codemirror-extensions-classname';
import { foldService } from '@codemirror/language';
import './JsonEditorPane.css';
import { toast } from 'react-hot-toast';

interface JsonEditorPanelProps {
  paneValue: string;
  /**
   *  setDoc Function Type
   */
  setPaneValue: (doc: string) => void;
  isEditable?: boolean;
  highlightedDiffKey?: string;
  diffKeys?: string[];
  isOriginalDoc?: boolean;
}

const foldingOnIndent = foldService.of((state, from, to) => {
  const line = state.doc.lineAt(from); // First line
  const lines = state.doc.lines; // Number of lines in the document
  const indent = line.text.search(/\S|$/); // Indent level of the first line
  let foldStart = from; // Start of the fold
  let foldEnd = to; // End of the fold

  // Check the next line if it is on a deeper indent level
  // If it is, check the next line and so on
  // If it is not, go on with the foldEnd
  let nextLine = line;
  while (nextLine.number < lines) {
    nextLine = state.doc.line(nextLine.number + 1); // Next line
    const nextIndent = nextLine.text.search(/\S|$/); // Indent level of the next line

    // If the next line is on a deeper indent level, add it to the fold
    if (nextIndent > indent) {
      foldEnd = nextLine.to; // Set the fold end to the end of the next line
    } else {
      break; // If the next line is not on a deeper indent level, stop
    }
  }

  // If the fold is only one line, don't fold it
  if (state.doc.lineAt(foldStart).number === state.doc.lineAt(foldEnd).number) {
    return null;
  }

  // Set the fold start to the end of the first line
  // With this, the fold will not include the first line
  foldStart = line.to;

  // Return a fold that covers the entire indent level
  return { from: foldStart, to: foldEnd };
});

/**
 *  JsonEditorPanel Component
 */
const JsonEditorPanel = ({
  paneValue,
  setPaneValue,
  isEditable = true,
  highlightedDiffKey,
  diffKeys,
  isOriginalDoc,
}: JsonEditorPanelProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  /**
   * JSON Error Handler
   */
  const jsonErrorHandler = (e: any) => {
    toast.error('Invalid JSON Structure!!');
  };

  /**
   * Add a className to specific line
   */
  const classNameExt = (lineNumber: number, className: string) =>
    classname({
      /**
       * add className handler
       */
      add: (lineNum) => {
        if (lineNumber === lineNum) return className;
      },
    });

  const extensions = useMemo(
    () => [
      basicSetup({
        foldGutter: true,
        dropCursor: false,
      }),
      foldingOnIndent,
      EditorView.focusChangeEffect.of(
        (state: EditorState, focusing: boolean) => {
          !focusing &&
            setPaneValue(
              Object.keys(
                safeJSONParse(state.doc.toString(), true, jsonErrorHandler)
              ).length
                ? state.doc.toString()
                : paneValue
            );
          return null;
        }
      ),
      EditorView.editable.of(isEditable),
      EditorState.readOnly.of(!isEditable),
    ],
    [isEditable, paneValue, setPaneValue]
  );

  if (isOriginalDoc !== undefined && highlightedDiffKey) {
    let lineNum;
    if (RegExp(/\[\d+\]/).test(highlightedDiffKey)) {
      lineNum = +highlightedDiffKey.slice(1, -1) + 2;
    } else {
      const keyIdx = Object.keys(safeJSONParse(paneValue)).findIndex(
        (key) => key === highlightedDiffKey
      );
      lineNum = keyIdx < 0 ? keyIdx : keyIdx + 2;
    }
    extensions.push(
      classNameExt(
        lineNum,
        isOriginalDoc ? 'expected-line-diff' : 'current-line-diff'
      )
    );
  }

  diffKeys?.forEach((key) => {
    let lineNum;
    if (RegExp(/\[\d+\]/).test(key)) {
      lineNum = +key.slice(1, -1) + 2;
    } else {
      const keyIdx = Object.keys(safeJSONParse(paneValue)).findIndex(
        (key) => key === highlightedDiffKey
      );
      lineNum = keyIdx < 0 ? keyIdx : keyIdx + 2;
    }
    extensions.push(classNameExt(lineNum, 'base-line-diff'));
  });

  useEffect(() => {
    if (editorRef.current === null) return;

    const state = EditorState.create({
      doc: new RegExp(
        /[{[]{1}([,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]|(\\?".*?\\?"))+[}\]]{1}/gm
      ).test(paneValue)
        ? JSON.stringify(safeJSONParse(paneValue), null, 2)
        : paneValue,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => view.destroy();
  }, [extensions, isEditable, paneValue, setPaneValue]);

  return <div ref={editorRef}></div>;
};

export default JsonEditorPanel;
