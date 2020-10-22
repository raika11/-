import React from 'react';
import { MokaTablePreviewButton, MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '컨테이너명',
        field: 'pageName',
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
