import React from 'react';
import { MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'componentSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '컴포넌트명',
        field: 'componentName',
        flex: 1,
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
