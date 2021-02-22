import React from 'react';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 50,
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 160,
        flex: 1,
        tooltipField: 'templateName',
        cellClassRules: {
            'usedyn-n': (params) => params.data.usedYn === 'N',
        },
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 70,
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 53,
        tooltipField: 'templateWidth',
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
