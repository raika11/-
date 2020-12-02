import React from 'react';
import { MokaTableAppendButton, MokaTableLinkButton } from '@components';

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
        width: 165,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 75,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '',
        field: 'append',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableAppendButton {...row} onClick={data.handleClickAppend} />;
        },
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
