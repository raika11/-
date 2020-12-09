import React from 'react';
import { MokaTableLoadButton, MokaTablePreviewButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기사페이지명',
        field: 'artPageName',
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'artPageName',
    },
    {
        headerName: '',
        field: 'load',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
    {
        headerName: '',
        field: 'preview',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTablePreviewButton {...row} onClick={data.handleClickPreview} />;
        },
    },
];

export default columnDefs;
