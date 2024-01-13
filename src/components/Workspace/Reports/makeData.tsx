import { ColumnDef } from '@tanstack/react-table';
import { MinusIcon, PlusIcon } from '../../../fa-icons';
import { Button } from '../../UI';
import {
  generateIgnoredDiffSummary,
  generateDetailedSummary,
  generateSimpleSummary,
  type SimpleDiffNodeData,
} from '../../../utils/helpers';
import { ComparisonReportForFlow } from '../../../models/reportModel';

const simpleDiffTableColumns: ColumnDef<SimpleDiffNodeData>[] = [
  {
    id: 'rawUri',
    accessorKey: 'rawUri',
    header: 'Raw Uri',
  },
  {
    id: 'flowName',
    accessorKey: 'flowName',
    header: 'Flow Name',
  },
  {
    id: 'nodeId',
    accessorKey: 'nodeId',
    header: 'Node ID',
  },
  {
    id: 'valueKey',
    accessorKey: 'valueKey',
    header: 'Key',
  },
  {
    id: 'valueExp',
    accessorKey: 'valueExp',
    header: 'Expected',
  },
  {
    id: 'valueCur',
    accessorKey: 'valueCur',
    header: 'Current',
  },
  {
    id: 'comparisonType',
    accessorKey: 'comparisonType',
    header: 'Comparison Type',
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: 'Location',
  },
];

type DetailedDiffTableData = {
  rawUri: string;
  flowName: string;
  nodeId: string;
  valueKey: string;
  valueExp: string;
  valueCur: string;
  dataTypeKey: string;
  dataTypeExp: string;
  dataTypeCur: string;
  uriKey: string;
  uriExp: string;
  uriCur: string;
  missingKey: string;
  extraKey: string;
  subRows?: Partial<DetailedDiffTableData>[];
  className?: string;
};

const detailedDiffTableDataInit: DetailedDiffTableData = {
  rawUri: '',
  flowName: '',
  nodeId: '',
  valueKey: '',
  valueExp: '',
  valueCur: '',
  dataTypeKey: '',
  dataTypeExp: '',
  dataTypeCur: '',
  uriKey: '',
  uriExp: '',
  uriCur: '',
  missingKey: '',
  extraKey: '',
};

/**
 * Generate Simple DiffTable Data (ForEach Row)
 */
const generateSimpleDiffTableData = (
  flowComparisonList: ComparisonReportForFlow[]
) => generateSimpleSummary(flowComparisonList);

const detailedDiffTableColumns: ColumnDef<DetailedDiffTableData>[] = [
  {
    id: 'expander',
    accessorKey: 'expander',
    /**
     * Expand All Button
     */
    header: ({ table }) => (
      <Button
        onClick={table.getToggleAllRowsExpandedHandler()}
        variant="primary"
        size="sm"
      >
        {table.getIsAllRowsExpanded() ? <MinusIcon /> : <PlusIcon />}
      </Button>
    ),
    /**
     * Expand Row Button
     */
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            row.toggleExpanded();
          }}
          variant="primary"
          size="sm"
        >
          {row.getIsExpanded() ? <MinusIcon /> : <PlusIcon />}
        </Button>
      ) : null,
  },
  {
    id: 'rawUri',
    accessorKey: 'rawUri',
    header: 'Raw Uri',
  },
  {
    id: 'flowName',
    accessorKey: 'flowName',
    header: 'Associated Flow',
  },
  {
    id: 'nodeId',
    accessorKey: 'nodeId',
    header: 'Node ID',
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: 'Value',
    columns: [
      {
        id: 'valueKey',
        accessorKey: 'valueKey',
        header: 'Key',
      },
      {
        id: 'valueExp',
        accessorKey: 'valueExp',
        header: 'Expected',
      },
      {
        id: 'valueCur',
        accessorKey: 'valueCur',
        header: 'Current',
      },
    ],
  },
  {
    id: 'dataType',
    accessorKey: 'dataType',
    header: 'Data Type',
    columns: [
      {
        id: 'dataTypeKey',
        accessorKey: 'dataTypeKey',
        header: 'Key',
      },
      {
        id: 'dataTypeExp',
        accessorKey: 'dataTypeExp',
        header: 'Expected',
      },
      {
        id: 'dataTypeCur',
        accessorKey: 'dataTypeCur',
        header: 'Current',
      },
    ],
  },
  {
    id: 'uri',
    accessorKey: 'uri',
    header: 'Uri',
    columns: [
      {
        id: 'uriKey',
        accessorKey: 'uriKey',
        header: 'Key',
      },
      {
        id: 'uriExp',
        accessorKey: 'uriExp',
        header: 'Expected',
      },
      {
        id: 'uriCur',
        accessorKey: 'uriCur',
        header: 'Current',
      },
    ],
  },
  {
    id: 'missingKey',
    accessorKey: 'missingKey',
    header: 'Missing Keys',
  },
  {
    id: 'extraKey',
    accessorKey: 'extraKey',
    header: 'Extra Keys',
  },
];

/**
 * Generate Detailed DiffTable Data (ForEach Row)
 */
const generateDetailedDiffTableData = (
  flowComparisonList: ComparisonReportForFlow[]
) => {
  const summary = generateDetailedSummary(flowComparisonList);
  const data: DetailedDiffTableData[] = Object.keys(summary).map((rawUri) => {
    const associatedFlows = Object.keys(summary[rawUri]);
    return {
      ...detailedDiffTableDataInit,
      rawUri,
      ...(associatedFlows.length && {
        subRows: associatedFlows.map((flowName) => {
          const nodeIds = Object.keys(summary[rawUri][flowName]);
          return {
            ...detailedDiffTableDataInit,
            flowName,
            ...(nodeIds.length && {
              subRows: nodeIds.map((nodeId) => {
                const node = summary[rawUri][flowName][nodeId];
                const biggestDiffArr = Object.values(node).reduce(
                  (acc, cur) => (cur.length > acc.length ? cur : acc),
                  []
                );
                const valueDifferencesData = node.valueDifferences.map(
                  (diff) => ({
                    valueKey: diff.key,
                    valueExp: diff.expected || '',
                    valueCur: diff.current || '',
                  })
                );
                const dataTypeDifferencesData = node.dataTypeDifferences.map(
                  (diff) => ({
                    dataTypeKey: diff.key,
                    dataTypeExp: diff.expected || '',
                    dataTypeCur: diff.current || '',
                  })
                );
                const uriDifferencesData = node.uriDifferences.map((diff) => ({
                  uriKey: diff.key,
                  uriExp: diff.expected || '',
                  uriCur: diff.current || '',
                }));
                const missingKeysData = node.missingKeys.map((diff) => ({
                  missingKey: diff.key,
                }));
                const extraKeysData = node.extraKeys.map((diff) => ({
                  extraKey: diff.key,
                }));
                return {
                  className: 'cursor-pointer',
                  ...detailedDiffTableDataInit,
                  nodeId,
                  ...(biggestDiffArr.length && {
                    subRows: biggestDiffArr.map((_, idx) => ({
                      className: 'cursor-pointer',
                      ...detailedDiffTableDataInit,
                      ...(valueDifferencesData[idx] &&
                        valueDifferencesData[idx]),
                      ...(dataTypeDifferencesData[idx] &&
                        dataTypeDifferencesData[idx]),
                      ...(uriDifferencesData[idx] && uriDifferencesData[idx]),
                      ...(missingKeysData[idx] && missingKeysData[idx]),
                      ...(extraKeysData[idx] && extraKeysData[idx]),
                    })),
                  }),
                };
              }),
            }),
          };
        }),
      }),
    };
  });
  return data;
};

const ignoredDiffTableColumns: ColumnDef<DetailedDiffTableData>[] = [
  {
    id: 'expander',
    accessorKey: 'expander',
    /**
     * Expand All Button
     */
    header: ({ table }) => (
      <Button
        onClick={table.getToggleAllRowsExpandedHandler()}
        variant="primary"
        size="sm"
      >
        {table.getIsAllRowsExpanded() ? <MinusIcon /> : <PlusIcon />}
      </Button>
    ),
    /**
     * Expand Row Button
     */
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            row.toggleExpanded();
          }}
          variant="primary"
          size="sm"
        >
          {row.getIsExpanded() ? <MinusIcon /> : <PlusIcon />}
        </Button>
      ) : null,
  },
  {
    id: 'rawUri',
    accessorKey: 'rawUri',
    header: 'Raw Uri',
  },
  {
    id: 'flowName',
    accessorKey: 'flowName',
    header: 'Associated Flow',
  },
  {
    id: 'nodeId',
    accessorKey: 'nodeId',
    header: 'Node ID',
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: 'Value',
    columns: [
      {
        id: 'valueKey',
        accessorKey: 'valueKey',
        header: 'Key',
      },
      {
        id: 'valueExp',
        accessorKey: 'valueExp',
        header: 'Expected',
      },
      {
        id: 'valueCur',
        accessorKey: 'valueCur',
        header: 'Current',
      },
    ],
  },
  {
    id: 'dataType',
    accessorKey: 'dataType',
    header: 'Data Type',
    columns: [
      {
        id: 'dataTypeKey',
        accessorKey: 'dataTypeKey',
        header: 'Key',
      },
      {
        id: 'dataTypeExp',
        accessorKey: 'dataTypeExp',
        header: 'Expected',
      },
      {
        id: 'dataTypeCur',
        accessorKey: 'dataTypeCur',
        header: 'Current',
      },
    ],
  },
  {
    id: 'uri',
    accessorKey: 'uri',
    header: 'Uri',
    columns: [
      {
        id: 'uriKey',
        accessorKey: 'uriKey',
        header: 'Key',
      },
      {
        id: 'uriExp',
        accessorKey: 'uriExp',
        header: 'Expected',
      },
      {
        id: 'uriCur',
        accessorKey: 'uriCur',
        header: 'Current',
      },
    ],
  },
  {
    id: 'missingKey',
    accessorKey: 'missingKey',
    header: 'Missing Keys',
  },
  {
    id: 'extraKey',
    accessorKey: 'extraKey',
    header: 'Extra Keys',
  },
];

/**
 * Generate Ignored DiffTable Data (ForEach Row)
 */
const generateIgnoredDiffTableData = (
  flowComparisonList: ComparisonReportForFlow[]
) => {
  const summary = generateIgnoredDiffSummary(flowComparisonList);
  const data: DetailedDiffTableData[] = Object.keys(summary).map((rawUri) => {
    const associatedFlows = Object.keys(summary[rawUri]);
    return {
      ...detailedDiffTableDataInit,
      rawUri,
      ...(associatedFlows.length && {
        subRows: associatedFlows.map((flowName) => {
          const nodeIds = Object.keys(summary[rawUri][flowName]);
          return {
            ...detailedDiffTableDataInit,
            flowName,
            ...(nodeIds.length && {
              subRows: nodeIds.map((nodeId) => {
                const node = summary[rawUri][flowName][nodeId];
                const biggestDiffArr = Object.values(node).reduce(
                  (acc, cur) => (cur.length > acc.length ? cur : acc),
                  []
                );
                const valueDifferencesData = node.valueDifferences.map(
                  (diff) => ({
                    valueKey: diff.key,
                    valueExp: diff.expected || '',
                    valueCur: diff.current || '',
                  })
                );
                const dataTypeDifferencesData = node.dataTypeDifferences.map(
                  (diff) => ({
                    dataTypeKey: diff.key,
                    dataTypeExp: diff.expected || '',
                    dataTypeCur: diff.current || '',
                  })
                );
                const uriDifferencesData = node.uriDifferences.map((diff) => ({
                  uriKey: diff.key,
                  uriExp: diff.expected || '',
                  uriCur: diff.current || '',
                }));
                const missingKeysData = node.missingKeys.map((diff) => ({
                  missingKey: diff.key,
                }));
                const extraKeysData = node.extraKeys.map((diff) => ({
                  extraKey: diff.key,
                }));
                return {
                  className: 'cursor-pointer',
                  ...detailedDiffTableDataInit,
                  nodeId,
                  ...(biggestDiffArr.length && {
                    subRows: biggestDiffArr.map((_, idx) => ({
                      className: 'cursor-pointer',
                      ...detailedDiffTableDataInit,
                      ...(valueDifferencesData[idx] &&
                        valueDifferencesData[idx]),
                      ...(dataTypeDifferencesData[idx] &&
                        dataTypeDifferencesData[idx]),
                      ...(uriDifferencesData[idx] && uriDifferencesData[idx]),
                      ...(missingKeysData[idx] && missingKeysData[idx]),
                      ...(extraKeysData[idx] && extraKeysData[idx]),
                    })),
                  }),
                };
              }),
            }),
          };
        }),
      }),
    };
  });
  return data;
};

export {
  detailedDiffTableColumns,
  generateDetailedDiffTableData,
  type DetailedDiffTableData,
  simpleDiffTableColumns,
  generateSimpleDiffTableData,
  ignoredDiffTableColumns,
  generateIgnoredDiffTableData,
};
