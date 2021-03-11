import React from 'react';
import WorkDescRenderer from '../components/WorkDescRenderer';
import WorkDelRenderer from '../components/WorkDelRenderer';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 45,
    },
    {
        headerName: '분류',
        field: 'category',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 50,
    },
    {
        headerName: '주기',
        field: 'period',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 50,
    },
    {
        headerName: 'URL / 배포 경로 / 설명',
        field: 'content',
        cellStyle: { lineHeight: '18px', height: '60px' },
        autoHeight: true,
        flex: 1,
        cellRendererFramework: (row) => <WorkDescRenderer {...row} />,
    },
    {
        headerName: '삭제 정보',
        field: 'info',
        width: 240,
        cellRendererFramework: (row) => <WorkDelRenderer {...row} />,
    },
];
