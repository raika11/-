import React from 'react';
import { MokaTableLinkButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기사타입명',
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
