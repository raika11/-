import React from 'react';
import { MokaTablePreviewButton, MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기사페이지명',
        field: 'artPageName',
        width: 240,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '',
        field: 'preview',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTablePreviewButton {...row} onClick={data.handleClickPreview} />;
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
