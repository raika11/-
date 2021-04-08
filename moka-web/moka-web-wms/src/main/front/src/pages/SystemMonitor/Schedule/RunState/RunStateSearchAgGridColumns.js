import React from 'react';
import WorkDescRenderer from '../components/WorkDescRenderer';
import WorkDateRenderer from '../components/WorkDateRenderer';
import WorkErrorRenderer from '../components/WorkErrorRenderer';

export default [
    {
        headerName: '번호',
        field: 'jobSeq',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 50,
    },
    {
        headerName: '분류',
        field: 'category',
        cellStyle: { lineHeight: '60px' },
        width: 60,
        tooltipField: 'category',
    },
    {
        headerName: '주기',
        field: 'periodNm',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 60,
    },
    {
        headerName: '패키지명 / 배포 경로 / 설명',
        field: '',
        cellStyle: { lineHeight: '18px', height: '60px' },
        autoHeight: true,
        flex: 1,
        cellRendererFramework: (row) => <WorkDescRenderer {...row} />,
    },
    {
        headerName: '결과/시간(ms)',
        field: '',
        cellStyle: { lineHeight: '18px' },
        width: 100,
        cellRendererFramework: (row) => <WorkDateRenderer {...row} />,
    },
    {
        headerName: '마지막 실행 정보',
        field: '',
        cellStyle: { lineHeight: '18px' },
        width: 150,
        cellRendererFramework: (row) => <WorkErrorRenderer {...row} />,
        tooltipField: 'jobStatus.errMgs',
    },
];
