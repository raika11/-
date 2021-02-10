import React from 'react';
import { MokaTablePreviewButton } from '@components';

export default [
    {
        colId: 'checkbox',
        width: 30,
        minWidth: 30,
        checkboxSelection: true,
        suppressMenu: true,
    },
    {
        headerName: '채널명',
        field: 'liveTitle',
        width: 100,
        flex: 1,
        autoHeight: true,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '송출상태',
        field: 'stateText',
        width: 64,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '미리보기',
        field: 'regDt',
        width: 64,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTablePreviewButton {...row} onClick={data.handleClickPreview} />;
        },
    },
    {
        headerName: '옵션',
        colId: 'options',
        width: 170,
        cellRenderer: 'optionRenderer',
        cellStyle: {
            lineHeight: '22px',
            fontSize: '12px',
        },
    },
];
