import React from 'react';
import ShowButtonRenderer from '../components/ShowButtonRenderer';

export default [
    {
        headerName: '번호',
        field: 'seq',
        width: 50,
        cellStyle: {},
    },
    {
        headerName: '조판날짜',
        field: 'pressDate',
        width: 100,
        cellStyle: {},
    },
    {
        headerName: '호',
        field: 'id.ho',
        width: 60,
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
        width: 40,
        cellStyle: {},
    },
    {
        headerName: '판',
        field: 'id.pan',
        width: 40,
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
        width: 140,
        cellStyle: {},
    },
    {
        headerName: '보기',
        field: 'show',
        width: 60,
        cellRendererFramework: ({ data }) => {
            return <ShowButtonRenderer {...data} onClick={() => data.onClick(data)} />;
        },
    },
];
