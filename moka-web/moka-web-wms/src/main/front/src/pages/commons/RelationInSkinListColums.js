import React from 'react';
import { MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'skinSeq',
        width: 50,
    },
    {
        headerName: '스킨명',
        field: 'skinName',
        width: 158,
    },
    {
        headerName: '스타일',
        field: 'skinStyle',
        width: 50,
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
