import React from 'react';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 60,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 262,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'containerName',
    },
    {
        headerName: '',
        field: 'delete',
        width: 40,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
