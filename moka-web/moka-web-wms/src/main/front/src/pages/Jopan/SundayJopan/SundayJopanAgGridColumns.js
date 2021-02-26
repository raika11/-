import React from 'react';
import ShowButtonRenderer from '../components/ShowButtonRenderer';

export default [
    {
        headerName: '번호',
        field: 'seq',
        width: 40,
        cellStyle: {},
    },
    {
        headerName: '조판날짜',
        field: 'pressDate',
        width: 85,
        cellStyle: {},
    },
    {
        headerName: '호',
        field: 'id.ho',
        width: 50,
        cellStyle: {},
        tooltipField: 'ho',
    },
    {
        headerName: '섹션',
        field: 'id.section',
        cellStyle: {},
        tooltipField: 'section',
        flex: 1,
    },
    {
        headerName: '면',
        field: 'id.myun',
        width: 35,
        cellStyle: {},
    },
    {
        headerName: '판',
        field: 'id.pan',
        width: 35,
        cellStyle: {},
    },
    {
        headerName: '버전',
        field: 'id.revision',
        width: 40,
        cellStyle: {},
    },
    {
        headerName: '생성일',
        field: 'regDt',
        width: 135,
        cellStyle: {},
    },
    {
        headerName: '보기',
        field: 'show',
        width: 55,
        cellRendererFramework: (params) => {
            return <ShowButtonRenderer {...params} onClick={() => params.data.onClick(params.data)} />;
        },
    },
];
