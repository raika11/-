import React from 'react';
import { MokaTableLoadButton, MokaTablePreviewButton, MokaTableLinkButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'pageSeq',
        width: 50,
    },
    {
        headerName: '페이지명',
        field: 'pageName',
        width: 204,
        tooltipField: 'pageName',
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
    {
        headerName: '',
        field: 'link',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLinkButton {...row} onClick={data.handleClickLink} />;
        },
    },
];

export default columnDefs;
