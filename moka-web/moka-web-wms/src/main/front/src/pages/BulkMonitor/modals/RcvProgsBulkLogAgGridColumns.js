import React from 'react';
import PortalNameRenderer from '../components/PortalNameRenderer';

export default [
    {
        headerName: '로그 ID',
        field: 'logSeq',
        width: 80,
        cellStyle: {},
        tooltipField: 'logSeq',
    },
    {
        headerName: '포털',
        field: 'portalDiv',
        cellStyle: {},
        flex: 1,
        cellRendererFramework: (param) => {
            return <PortalNameRenderer {...param} />;
        },
    },
    {
        headerName: 'IUD',
        field: 'iud',
        cellStyle: {},
        width: 40,
    },
    {
        headerName: '시작일시',
        field: 'startDt',
        width: 150,
        cellStyle: {},
    },
    {
        headerName: '종료일시',
        field: 'endDt',
        width: 150,
        cellStyle: {},
    },
    {
        headerName: '상태',
        field: 'status',
        width: 50,
        cellStyle: {},
    },
];
