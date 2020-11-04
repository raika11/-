import React from 'react';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 160,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 65,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 53,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateWidth',
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
