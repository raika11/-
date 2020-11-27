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
        width: 80,
    },
    {
        headerName: '이름',
        field: 'repName',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '소속',
        field: 'belong',
        cellStyle: { fontSize: '12px' },
        width: 180,
        flex: 1,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        cellStyle: { fontSize: '12px' },
        width: 160,
        flex: 1,
    },
    {
        headerName: '노출여부',
        field: 'usedYn',
        cellStyle: { fontSize: '12px', textAlign: 'center' },
        width: 70,
    },
    {
        headerName: '',
        field: 'reporterPage',
        width: 90,
        flex: 1,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <ReporterPageButton {...row} data={data} />;
        },
    },
];
