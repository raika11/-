import React from 'react';
import { MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 276,
        cellStyle: { fontSize: '12px' },
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
