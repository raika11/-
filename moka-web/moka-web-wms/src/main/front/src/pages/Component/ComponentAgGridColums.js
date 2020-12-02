import React from 'react';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'componentSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '컴포넌트명',
        field: 'componentName',
        width: 178,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'componentName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 100,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateGroupName',
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
