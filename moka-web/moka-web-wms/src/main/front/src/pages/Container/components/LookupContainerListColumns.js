import React from 'react';
import { MokaTableAppendButton, MokaTableLinkButton, MokaTableLoadButton } from '@components';

const columnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 240,
        flex: 1,
        tooltipField: 'containerName',
    },
    {
        headerName: '',
        field: 'append',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableAppendButton {...row} onClick={data.handleClickAppend} />;
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

export const ctColumnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 240,
        tooltipField: 'containerName',
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
        field: 'link',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLinkButton {...row} onClick={data.handleClickLink} />;
        },
    },
];

export default columnDefs;
