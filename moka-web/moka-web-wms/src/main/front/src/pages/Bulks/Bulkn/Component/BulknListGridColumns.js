import React from 'react';
import ServiceRenderer from './ServiceRenderer';
import PreviewRenderer from './PreviewRenderer';

export const ColumnDefs = [
    {
        headerName: ' ID',
        field: 'bulkartSeq',
        width: 70,
        cellStyle: { alignItems: 'center' },
    },
    {
        headerName: '\t전송일시',
        field: 'sendDt',
        width: 200,
        cellStyle: { alignItems: 'center' },
    },
    {
        headerName: '등록자',
        field: 'regInfo',
        width: 150,
        flex: 1,
        cellStyle: { alignItems: 'center' },
    },
    {
        headerName: '서비스',
        field: 'used',
        width: 100,
        cellRendererFramework: ({ value }) => <ServiceRenderer {...value} />,
        cellStyle: { paddingTop: '7px', alignItems: 'center' },
    },
    {
        headerName: '\t보기',
        field: 'preview',
        width: 120,
        cellRendererFramework: ({ value }) => <PreviewRenderer {...value} />,
        cellStyle: { paddingTop: '2px', alignItems: 'center' },
    },
];
