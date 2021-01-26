import React from 'react';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 60,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        flex: 1,
        width: 268,
        tooltipField: 'containerName',
    },
    {
        headerName: '',
        field: 'delete',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
