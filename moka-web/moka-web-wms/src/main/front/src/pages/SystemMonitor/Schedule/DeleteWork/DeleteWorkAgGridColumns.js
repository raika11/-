import React from 'react';
import WorkDescRenderer from '../components/WorkDescRenderer';

export default [
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
        headerName: 'URL / 배포 경로 / 설명',
        field: '',
        cellStyle: { lineHeight: '18px', height: '60px' },
        autoHeight: true,
        flex: 1,
        cellRendererFramework: (row) => <WorkDescRenderer {...row} />,
    },
    {
        headerName: '삭제 정보',
        field: 'delInfo',
        cellStyle: { textOverflow: 'ellipsis', lineHeight: '60px' },
        width: 250,
        tooltipField: 'delInfo',
    },
];
