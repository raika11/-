import React from 'react';
import { MokaTableLinkButton } from '@components';

export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 297,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 120,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 80,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateWidth',
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
