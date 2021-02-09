import React from 'react';
import { MokaTableAppendButton, MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 50,
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 155,
        flex: 1,
        tooltipField: 'templateName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 75,
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '',
        field: 'append',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableAppendButton {...row} onClick={data.handleClickAppend} />;
        },
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
