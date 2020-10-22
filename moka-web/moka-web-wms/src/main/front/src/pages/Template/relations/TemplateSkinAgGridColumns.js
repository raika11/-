import React from 'react';
import { MokaTablePreviewButton, MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'skinSeq',
        width: 50,
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '스킨명',
        field: 'skinName',
        width: 158,
    },
    {
        headerName: '스타일',
        field: 'skinStyle',
        width: 158,
    },
    {
        headerName: '',
        field: 'preview',
        width: 36,
        cellRendererFramework: (row) => <MokaTablePreviewButton {...row} />,
    },
    {
        headerName: '',
        field: 'link',
        width: 36,
        cellRendererFramework: (row) => <MokaTableLinkButton {...row} />,
    },
];
