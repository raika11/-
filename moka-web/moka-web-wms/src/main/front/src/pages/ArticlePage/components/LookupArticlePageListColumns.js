import React from 'react';
import { MokaTableLoadButton, MokaTablePreviewButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 50,
    },
    {
        headerName: '아티클페이지명',
        field: 'artPageName',
        flex: 1,
        tooltipField: 'artPageName',
    },
    {
        headerName: '',
        field: 'load',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
    {
        headerName: '',
        field: 'preview',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTablePreviewButton {...row} onClick={data.handleClickPreview} />;
        },
    },
];

export default columnDefs;
