import React from 'react';
import { EtcButtonRenderer } from './GridRenderer';

export const tempColumnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 70,
        tooltipFied: 'id',
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '전송일시',
        field: 'sendDt',
        width: 130,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '사진',
        field: 'imgUrl',
        cellRenderer: 'imageRenderer',
        width: 60,
    },
    {
        headerName: 'SNS제목',
        field: 'title',
        wrapText: true,
        width: 250,
        flex: 1,
        tooltipField: 'title',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
        },
    },
    {
        headerName: '사용여부',
        field: 'usedYn',
        width: 64,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '기타',
        field: 'id',
        width: 195,
        cellRendererFramework: (params) => <EtcButtonRenderer {...params} />,
    },
];
