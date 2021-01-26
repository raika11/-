import React from 'react';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 100,
    },
    {
        headerName: '기사페이지명',
        field: 'artPageName',
        width: 160,
        flex: 1,
        tooltipField: 'artPageName',
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
