import { ColumnDef } from '@tanstack/react-table';
import { Env, EnvVariable } from '../../../models';
import { ReactNode } from 'react';

type EnvVariablesTableData = EnvVariable & {
  className?: string;
  action?: ReactNode;
};

type EnvsTableData = {
  selected?: ReactNode;
  name: string;
  varsCount: number;
  className?: string;
  action?: ReactNode;
};

type BaseUrlTableData = {
  selected?: ReactNode;
  url: string;
  action?: ReactNode;
};

const envVariablesTableColumns: ColumnDef<EnvVariable>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    meta: {
      className: 'text-sm justify-center',
    },
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: 'Initial Value',
    meta: {
      className: 'text-sm justify-center',
    },
  },
  {
    id: 'current',
    accessorKey: 'current',
    header: 'Current Value',
    meta: {
      className: 'text-sm justify-center',
    },
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: '',
    /**
     * Generate React Element
     */
    cell: ({ getValue }) => getValue(),
  },
];

const envsTableColumns: ColumnDef<Omit<Env, 'variables'>>[] = [
  {
    id: 'selected',
    accessorKey: 'selected',
    header: '',
    /**
     * Generate React Element
     */
    cell: ({ getValue }) => getValue(),
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    meta: {
      className: 'text-sm justify-center',
    },
  },
  {
    id: 'varsCount',
    accessorKey: 'varsCount',
    header: 'Variables Count',
    meta: {
      className: 'text-sm justify-center',
    },
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: '',
    /**
     * Generate React Element
     */
    cell: ({ getValue }) => getValue(),
  },
];

const baseUrlsTableColumns: ColumnDef<BaseUrlTableData>[] = [
  {
    id: 'selected',
    accessorKey: 'selected',
    header: '',
    /**
     * Generate React Element
     */
    cell: ({ getValue }) => getValue(),
  },
  {
    id: 'url',
    accessorKey: 'url',
    header: 'URL',
    meta: {
      className: 'text-sm',
    },
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: '',
    /**
     * Generate React Element
     */
    cell: ({ getValue }) => getValue(),
  },
];

const baseUrlsTableHeadingClassNames = {
  selected: 'w-[1%]',
  action: 'w-[1%]',
};

export {
  type EnvVariablesTableData,
  envVariablesTableColumns,
  type EnvsTableData,
  envsTableColumns,
  type BaseUrlTableData,
  baseUrlsTableColumns,
  baseUrlsTableHeadingClassNames,
};
