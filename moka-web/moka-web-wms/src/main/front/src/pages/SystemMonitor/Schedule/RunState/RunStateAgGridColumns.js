import React from 'react';
import WorkStatisticRenderer from '../components/WorkStatisticRenderer';

export default [
    {
        headerName: '분류',
        field: 'serverNm',
        tooltipField: 'serverNm',
        flex: 1,
    },
    {
        headerName: '30초',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a30} stateB={row.data.b30} />,
    },
    {
        headerName: '1분',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a60} stateB={row.data.b60} />,
    },
    {
        headerName: '2분',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a120} stateB={row.data.b120} />,
    },
    {
        headerName: '5분',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a300} stateB={row.data.b300} />,
    },
    {
        headerName: '10분',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a600} stateB={row.data.b600} />,
    },
    {
        headerName: '20분',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a1200} stateB={row.data.b1200} />,
    },
    {
        headerName: '30분',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a1800} stateB={row.data.b1800} />,
    },
    {
        headerName: '1시간',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a3600} stateB={row.data.b3600} />,
    },
    {
        headerName: '12시간',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a43200} stateB={row.data.b43200} />,
    },
    {
        headerName: '24시간',
        field: '',
        width: 65,
        cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a86400} stateB={row.data.b86400} />,
    },
    {
        headerName: '상시',
        field: '',
        width: 65,
        // cellRendererFramework: (row) => <WorkStatisticRenderer {...row} stateA={row.data.a86400} stateB={row.data.b86400} />,
    },
];
