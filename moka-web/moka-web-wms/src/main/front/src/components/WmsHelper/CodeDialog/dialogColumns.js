import React from 'react';
import CodeIdRow from './CodeIdRow';

export const lgTableColums = [
    {
        id: 'searchCodeId',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '대분류',
        align: 'left',
        component: (row, options) => <CodeIdRow row={row} options={options} />
    }
];

export const mdTableColumns = [
    {
        id: 'searchCodeId',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '중분류',
        align: 'left',
        component: (row, options) => <CodeIdRow row={row} options={options} />
    }
];

export const smTableColumns = [
    {
        id: 'searchCodeId',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '소분류',
        align: 'left',
        component: (row, options) => <CodeIdRow row={row} options={options} />
    }
];
