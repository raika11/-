import React from 'react';
import { MokaTablePreviewButton } from '@components';

export default [
    {
        colId: 'checkbox',
        width: 30,
        checkboxSelection: true,
        suppressMenu: true,
    },
    {
        headerName: '채널명',
        field: 'name',
        width: 186,
        flex: 1,
        autoHeight: true,
        tooltipField: 'name',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '22px',
            fontSize: '12px',
            height: '66px',
            display: '-webkit-box',
            '-webkit-line-clamp': 3,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '송출상태',
        field: 'stateText',
        width: 40,
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
        width: 83,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTablePreviewButton {...row} onClick={data.handleClickPreview} />;
        },
    },
    {
        headerName: '옵션',
        colId: 'options',
        width: 83,
        cellRenderer: 'optionRenderer',
        cellStyle: {
            lineHeight: '22px',
            fontSize: '12px',
        },
    },
];
