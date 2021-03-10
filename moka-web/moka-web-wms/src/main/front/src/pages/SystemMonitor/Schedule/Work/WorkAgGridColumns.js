import React from 'react';
import WorkDescRenderer from '../components/WorkDescRenderer';
import WorkStateRenderer from '../components/WorkStateRenderer';

export default [
    {
        headerName: '',
        field: 'usedYn',
        width: 36,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '번호',
        field: 'jobSeq',
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
        headerName: '패키지명 / 배포 경로 / 설명',
        field: 'content',
        cellStyle: { lineHeight: '18px', height: '60px' },
        autoHeight: true,
        flex: 1,
        cellRendererFramework: (row) => <WorkDescRenderer {...row} />,
    },
    {
        headerName: '등록 / 수정 정보',
        field: 'info',
        width: 240,
        cellRendererFramework: (row) => <WorkStateRenderer {...row} />,
    },
];
