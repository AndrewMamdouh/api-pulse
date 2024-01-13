import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

export type ScriptPaneProps = {
  paneValue: string;
  /**
   *  Update Pre Request Script
   */
  setPaneValue: (value: string) => void;
  isEditable?: boolean;
};

/**
 *  ScriptPane Component
 */
const ScriptPane = ({
  paneValue = '',
  setPaneValue,
  isEditable = true,
}: ScriptPaneProps) => {
  /**
   *  ChangeHandler For Script Editor
   */
  const handleScriptChange = (newScriptContent = '') =>
    setPaneValue(newScriptContent);

  // TODO: Make it debounced

  return (
    <div>
      <AceEditor
        mode="javascript"
        height={'360px'}
        width={'100%'}
        name="script-editor"
        onChange={handleScriptChange}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={paneValue}
        readOnly={!isEditable}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
          showFoldWidgets: true,
        }}
      />
    </div>
  );
};

export default ScriptPane;
