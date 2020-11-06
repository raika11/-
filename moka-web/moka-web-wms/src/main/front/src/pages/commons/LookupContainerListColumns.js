import React from 'react';
import { MokaTableAppendButton, MokaTableLinkButton } from '@components';

const columnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 240,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'containerName',
    },
    {
        headerName: '',
        field: 'append',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableAppendButton {...row} onClick={data.handleClickAppend} />;
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

export const ctColumnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 276,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'containerName',
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
