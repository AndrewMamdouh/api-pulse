import React from 'react';
import { Pair } from '../../../models';

type ResponseHeaderPaneProps = {
  headers: Pair<string>;
};

/**
 *  ResponseHeaderPane Component
 */
export default function ResponseHeaderPane({
  headers,
}: ResponseHeaderPaneProps) {
  const renderedHeaders = Object.entries(headers).map(([key, value]) => {
    return (
      <tr key={key}>
        <td className="pb-1">{key}</td>
        <td>{value}</td>
      </tr>
    );
  });
  return (
    <table className="text-left">
      <thead>
        <tr>
          <th className="w-36 pb-1.5">Key</th>
          <th className="w-60">Value</th>
        </tr>
      </thead>
      <tbody>{renderedHeaders}</tbody>
    </table>
  );
}
