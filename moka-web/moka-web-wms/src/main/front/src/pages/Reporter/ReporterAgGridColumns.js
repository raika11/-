import React from 'react';
import ReporterPageButton from './components/ReporterPageButton';

export const columnDefs = [
    {
        headerName: '번호',
        field: 'repSeq',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '이름',
        field: 'repName',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '소속',
        field: 'jplusJobInfo',
        cellStyle: { fontSize: '12px' },
        width: 140,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        cellStyle: { fontSize: '12px' },
        width: 160,
    },
    {
        headerName: '노출여부',
        field: 'usedYn',
        cellStyle: { fontSize: '12px' },
        width: 70,
    },
    {
        headerName: '',
        field: 'reporterPage',
        width: 130,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <ReporterPageButton {...row} data={data} />;
        },
    },
];

export const rowData = [
    {
        repSeq: 1000,
        joinsId: 'Richards',
        repName: '강기헌',
        jplusJobInfo: '중앙일보 편집부 기자',
        repEmail1: 'crutis@test.com',
        usedYn: 'Y',
    },
];
