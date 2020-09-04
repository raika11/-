import React from 'react';
import DomainDeleteButton from './DomainDeleteButton';

const tableColumns = [
    {
        id: 'domainId',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 60,
        align: 'center'
    },
    {
        id: 'domainUrl',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'URL',
        width: 150,
        align: 'left'
    },
    {
        id: 'domainName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '도메인명',
        width: 150,
        align: 'left'
    },
    {
        id: '',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'left',
        component: (row) => <DomainDeleteButton row={row} />
    }
];

export default tableColumns;

export const volumeColumns = [
    {
        id: 'radio',
        format: 'radio',
        sort: false,
        disablePadding: true,
        label: '',
        width: 40,
        align: 'center'
    },
    {
        id: 'volumeId',
        format: '',
        sort: false,
        disablePadding: true,
        label: '볼륨ID',
        width: 100,
        rowspan: 2,
        align: 'center'
    },
    {
        id: 'volumeName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '볼륨명',
        width: 300,
        rowspan: 2,
        align: 'center'
    }
];
