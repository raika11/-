import React from 'react';
import ServiceRenderer from './ServiceRenderer';
import PreviewRenderer from './PreviewRenderer';

export const ColumnDefs = [
    {
        headerName: ' ID',
        field: 'bulkartSeq',
        width: 70,
    },
    {
        headerName: '전송일시',
        field: 'sendDt',
        width: 155,
    },
    {
        headerName: '등록자',
        field: 'regInfo',
        width: 150,
        flex: 1,
    },
    {
        headerName: '서비스',
        field: 'used',
        width: 70,
        cellRendererFramework: ({ value }) => <ServiceRenderer {...value} />,
    },
    {
        headerName: '보기',
        field: 'preview',
        width: 77,
        cellRendererFramework: ({ value }) => <PreviewRenderer {...value} />,
    },
];
