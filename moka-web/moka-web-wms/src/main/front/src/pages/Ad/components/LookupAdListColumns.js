import React from 'react';
import { MokaTableAppendButton, MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'adSeq',
        width: 50,
    },
    {
        headerName: '광고명',
        field: 'adNm',
        width: 155,
        flex: 1,
        tooltipField: 'adNm',
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
