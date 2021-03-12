import React from 'react';
import { MokaTablePreviewButton, MokaTableLinkButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 50,
    },
    {
        headerName: '아티클페이지명',
        field: 'artPageName',
        width: 240,
        flex: 1,
    },
    {
        headerName: '',
        field: 'preview',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTablePreviewButton {...row} onClick={data.handleClickPreview} />;
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
