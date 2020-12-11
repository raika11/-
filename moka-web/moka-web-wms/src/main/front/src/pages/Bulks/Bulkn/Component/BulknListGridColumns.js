import React from 'react';
import ServiceRenderer from './ServiceRenderer';
import PreviewRenderer from './PreviewRenderer';

export const ColumnDefs = [
    {
        headerName: 'ID',
        field: 'bulkartSeq',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '20px', alignItems: 'center' },
    },
    {
        headerName: '\t전송일시',
        field: 'sendDt',
        width: 200,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px', alignItems: 'center' },
    },
    {
        headerName: '작성자',
        field: 'regId',
        width: 150,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px', alignItems: 'center' },
    },
    {
        headerName: '서비스',
        field: 'used',
        width: 100,
        cellRendererFramework: ({ value }) => <ServiceRenderer {...value} />,
        cellStyle: { fontSize: '12px', lineHeight: '40px', paddingTop: '22px', alignItems: 'center' },
    },
    {
        headerName: '\t보기',
        field: 'preview',
        width: 120,
        cellRendererFramework: ({ value }) => <PreviewRenderer {...value} />,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingLeft: '10px', paddingTop: '20px', alignItems: 'center' },
    },
];
