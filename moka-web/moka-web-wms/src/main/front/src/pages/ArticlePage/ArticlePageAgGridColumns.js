import React from 'react';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 100,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기사페이지명',
        field: 'artPageName',
        width: 160,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'artPageName',
    },
    {
        headerName: '',
        field: 'delete',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
