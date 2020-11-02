import React from 'react';
import { MokaTableLoadButton, MokaTablePreviewButton, MokaTableLinkButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'pageSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '페이지명',
        field: 'pageName',
        width: 202,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'pageName',
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
    {
        headerName: '',
        field: 'link',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLinkButton {...row} onClick={data.handleClickLink} />;
        },
    },
];

export default columnDefs;
