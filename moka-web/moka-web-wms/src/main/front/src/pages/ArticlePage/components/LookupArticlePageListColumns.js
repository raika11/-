import React from 'react';
import { MokaTableLinkButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'articlePageSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기사페이지명',
        field: 'skinName',
        width: 276,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'skinName',
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

export default columnDefs;
