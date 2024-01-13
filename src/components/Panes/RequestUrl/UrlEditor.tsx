import React from 'react';
import { RequestTypes } from '../../../models';

type UrlEditorProps = {
  url: string;
  /**
   * setUrl Function Type
   */
  //setUrl: (url: string) => void;
  reqMethod: RequestTypes;
  /**
   * setReqMethod Function Type
   */
  setReqMethod: (method: RequestTypes) => void;
  /**
   * onInputSend Function Type
   */
  onInputSend: (toOurBackend: boolean) => Promise<void>;
  /**
   * setQueryParams Function Type
   */
  // setQueryParams: (queryParams: Pair<string[]>) => void;
};

/**
 *  UrlEditor Component
 */
export default function UrlEditor({
  url,
  //setUrl,
  reqMethod,
  setReqMethod,
  onInputSend,
}: // setQueryParams,
UrlEditorProps) {
  /**
   *  Filter Url
   */
  // const splitInput = (input: string) => {
  //   const parts = input.split(/(\{\{[^}]+\}\})/);
  //   return parts.map((part, index) => {
  //     if (part.match(/^\{\{[^}]+\}\}$/)) {
  //       // This part contains {{someVariable}}
  //       return (
  //         <span
  //           key={index}
  //           style={{
  //             color: 'brown',
  //             background: 'rgb(250, 128, 114, 0.2)',
  //           }}
  //         >
  //           {part}
  //         </span>
  //       );
  //     } else {
  //       // This part does not contain {{someVariable}}
  //       return <span key={index}>{part}</span>;
  //     }
  //   });
  // };

  return (
    <form className="flex">
      <select
        className="px-4 py-2 border rounded-md border-gray-300 hover:border-blue-500 focus:outline-none bg-gray-100"
        value={reqMethod}
        onChange={(e) => setReqMethod(e.target.value as RequestTypes)}
      >
        {Object.keys(RequestTypes)
          .filter((type) => isNaN(Number(type)))
          .map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
      </select>
      <div className="ml-3 w-full">
        <input
          className="w-full p-2 border rounded-md border-gray-300 hover:border-blue-500 focus:outline-none"
          value={url}
          readOnly
          disabled
          //onChange={(e) => setUrl(e.target.value)}
        />
        {/* <div
          style={{
            position: 'absolute',
            top: 10,
            left: 17,
            pointerEvents: 'none',
          }}
        >
          {splitInput(url)}
        </div> */}
      </div>
      <button
        className="whitespace-nowrap ml-3 px-6 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-orange-600"
        type="button"
        onClick={() => onInputSend(true)}
      >
        Send To Our Server
      </button>
      <button
        className="ml-3 px-6 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-orange-600"
        type="button"
        onClick={() => onInputSend(false)}
      >
        Send
      </button>
    </form>
  );
}
