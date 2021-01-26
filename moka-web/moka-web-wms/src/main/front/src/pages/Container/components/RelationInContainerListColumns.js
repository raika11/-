import React from 'react';
import { MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 276,
        flex: 1,
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
