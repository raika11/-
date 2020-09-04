import React from 'react';
import ResourceDeleteButton from './ResourceDeleteButton';

export const historyColumns = [
    {
        id: 'seq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'NO',
        width: 70,
        align: 'left'
    },
    {
        id: 'createYmdt',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업일시',
        width: 150,
        align: 'center'
    },
    {
        id: 'creator',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업자',
        width: 100,
        align: 'center'
    },
    {
        id: 'actions',
        format: 'container',
        sort: false,
        disablePadding: true,
        label: '불러오기',
        width: 80,
        align: 'center',
        container: (row) => <ResourceDeleteButton row={row} />
    }
];
