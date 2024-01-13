import {
  RowData,
  TableOptions,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  OnChangeFn,
  ExpandedState,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { useLayoutEffect, useState } from 'react';
import { SortBottomIcon, SortTopIcon } from '../../../fa-icons';
import { safeJSONParse } from '../../../utils/helpers';
import { useLocalStorage } from '../../../hooks';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type TableProps<TData> = PartialBy<TableOptions<TData>, 'getCoreRowModel'> & {
  hiddenColumnsLocalStorageKey?: string;
  striped?: boolean;
  bordered?: boolean;
  hasHoverEffect?: boolean;
  rowHoverClassName?: string;
  /**
   * rowClickHandler Function Type
   */
  rowClickHandler?: Function;
  spacing?: 'sm' | 'md' | 'lg';
  headingClassNames?: { [id: string]: string };
  cellClassNames?: { [id: string]: string };
};

/**
 * Table Component
 */
const Table = <TData extends RowData>({
  striped = false,
  bordered = false,
  hasHoverEffect = false,
  rowHoverClassName = 'hover:text-white hover:bg-blue-600',
  data = [],
  columns = [],
  enableHiding = false,
  enableSorting = false,
  hiddenColumnsLocalStorageKey = '',
  rowClickHandler,
  spacing = 'md',
  headingClassNames = {},
  cellClassNames = {},
  ...rest
}: TableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { setItem, getItem } = useLocalStorage();

  /**
   * Column Visibility Change Handler
   */
  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updater
  ) => {
    setColumnVisibility(
      typeof updater === 'function' ? updater(columnVisibility) : updater
    );
    if (hiddenColumnsLocalStorageKey) {
      setItem(
        hiddenColumnsLocalStorageKey,
        JSON.stringify(
          typeof updater === 'function' ? updater(columnVisibility) : updater
        )
      );
    }
  };

  useLayoutEffect(() => {
    setColumnVisibility(safeJSONParse(getItem(hiddenColumnsLocalStorageKey)));
  }, [getItem, hiddenColumnsLocalStorageKey]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      expanded,
    },
    /**
     * Get All Sub Rows
     */
    //@ts-ignore
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel<TData>(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel<TData>(),
    getExpandedRowModel: getExpandedRowModel<TData>(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onExpandedChange: setExpanded,
    enableHiding,
    enableSorting,
    ...rest,
  });

  /**
   * Generate Table Cell Spacing
   */
  const getTableSpacing = () => {
    switch (spacing) {
      case 'sm':
        return 'py-2.5 px-2';
      case 'md':
        return 'py-3.5 px-3';
      case 'lg':
        return 'py-4.5 px-4';
    }
  };

  const tableSpacing = getTableSpacing();

  return (
    <div>
      {enableHiding ? (
        <div className="flex items-center gap-5 flex-wrap py-2 px-4">
          {table.getAllLeafColumns().map((column) => {
            return (
              <label
                key={`${column.id}-label`}
                className="capitalize font-semibold flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 focus:ring"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                {typeof column.columnDef.header === 'string'
                  ? column.columnDef.header
                  : column.id}
              </label>
            );
          })}
        </div>
      ) : null}
      <div className="overflow-auto max-h-screen">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full max-h-full border-separate border-spacing-0">
            <thead className="sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      colSpan={header.colSpan}
                      className={`border-b border-gray-300 whitespace-nowrap bg-white/75 text-left capitalize font-semibold text-gray-900 backdrop-blur backdrop-filter ${tableSpacing} ${
                        headingClassNames[header.id]
                          ? headingClassNames[header.id]
                          : ''
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex justify-start items-center gap-3 ${
                            (header.column.columnDef.meta as any)?.className ||
                            ''
                          } ${
                            header.column.getCanSort() ? 'cursor-pointer' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {!header.column.getCanSort()
                            ? null
                            : {
                                asc: <SortTopIcon />,
                                desc: <SortBottomIcon />,
                              }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  onClick={() => rowClickHandler && rowClickHandler(row)}
                  className={`${
                    striped && idx % 2 !== 0 ? 'bg-gray-100' : 'bg-white'
                  } text-gray-500 ${
                    hasHoverEffect ? rowHoverClassName : ''
                  } transition-all duration-100 ease-in ${
                    (row.original as any).className || ''
                  }`}
                  style={{
                    ...(bordered && idx && { boxShadow: '0 -1px 0 #d1d5db' }),
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap text-sm ${tableSpacing} ${
                        cellClassNames[cell.id] ? cellClassNames[cell.id] : ''
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
