import React from 'react';
import DatasetListDeleteButton from './DatasetListDeleteButton';

export const tableSearchTypes = [
    { id: 'all', name: '데이타셋 전체' },
    { id: 'datasetSeq', name: '데이타셋ID' },
    { id: 'datasetName', name: '데이타셋명' }
];

export const autoCreateSearchTypes = [
    { id: 'all', name: '타입 전체' },
    { id: 'N', name: '수동' },
    { id: 'Y', name: '자동' }
];

/**
 * 목록에서 줄 높이
 */
// export const rowHeight = 51; // 두 줄
export const rowHeight = 32;

/**
 * 목록 이외의 높이
 */
export const otherHeight = 128;

export const tableColumns = [
    {
        id: 'datasetSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 66,
        align: 'center'
    },
    {
        id: 'datasetName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '데이터셋명',
        width: 215,
        align: 'left'
    },
    {
        id: 'autoCreateYn',
        format: '',
        sort: false,
        disablePadding: true,
        label: '',
        width: 70,
        align: 'center'
    },
    {
        id: 'datasetDelete',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 40,
        align: 'center',
        component: (row) => <DatasetListDeleteButton row={row} />
    }
];

export default tableColumns;
