import React from 'react';
// import WorkIpHostRenderer from '../components/WorkIpHostRenderer';
import WorkStateRenderer from '../components/WorkStateRenderer';

export default [
    {
        headerName: '번호',
        field: 'serverSeq',
        width: 45,
    },
    {
        headerName: '별칭',
        field: 'serverNm',
        width: 180,
    },
    {
        headerName: 'IP / HOST',
        field: 'serverIp',
        // cellRendererFramework: (row) => <WorkIpHostRenderer {...row} />,
        flex: 1,
    },
    {
        headerName: '계정 정보',
        field: 'accessId',
        width: 180,
    },
    {
        headerName: '등록 / 수정 정보',
        field: 'info',
        cellStyle: { lineHeight: '18px', height: '40px' },
        width: 240,
        autoHeight: true,
        cellRendererFramework: (row) => <WorkStateRenderer {...row} />,
    },
];
