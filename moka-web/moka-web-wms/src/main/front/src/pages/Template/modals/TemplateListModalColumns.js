import React from 'react';
import { MokaTableLinkButton } from '@components';

export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 70,
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 270,
        flex: 1,
        tooltipField: 'templateName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 120,
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 80,
        tooltipField: 'templateWidth',
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
