import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
// import WorkServerSeqRenderer from '../components/WorkServerSeqRenderer';
import WorkDescRenderer from '../components/WorkDescRenderer';
import WorkStateRenderer from '../components/WorkStateRenderer';

export default [
    {
        headerName: '번호',
        field: 'jobSeq',
        width: 45,
        cellClass: 'ag-center-cell',
    },
    {
        headerName: '분류',
        field: 'categoryNm',
        width: 50,
        tooltipField: 'categoryNm',
        cellStyle: {
            lineHeight: `${GRID_LINE_HEIGHT.T[2]}px`,
        },
    },
    {
        headerName: '주기',
        field: 'periodNm',
        width: 50,
        cellClass: 'ag-center-cell',
    },
    {
        headerName: '패키지명 / 배포 경로 / 설명',
        field: 'desc',
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        flex: 1,
        cellRendererFramework: (row) => <WorkDescRenderer {...row} />,
    },
    {
        headerName: '등록 / 수정 정보',
        field: 'info',
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        width: 240,
        cellRendererFramework: (row) => <WorkStateRenderer {...row} />,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
