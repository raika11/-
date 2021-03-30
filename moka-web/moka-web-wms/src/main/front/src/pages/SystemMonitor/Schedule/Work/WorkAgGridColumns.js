import React from 'react';
// import WorkServerSeqRenderer from '../components/WorkServerSeqRenderer';
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
        field: 'categoryNm',
        cellStyle: { textOverflow: 'ellipsis', lineHeight: '60px' },
        width: 50,
        tooltipField: 'categoryNm',
    },
    {
        headerName: '주기',
        field: 'periodNm',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 50,
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
        headerName: '등록 / 수정 정보',
        field: '',
        cellStyle: { lineHeight: '18px' },
        width: 240,
        cellRendererFramework: (row) => <WorkStateRenderer {...row} />,
    },
];
