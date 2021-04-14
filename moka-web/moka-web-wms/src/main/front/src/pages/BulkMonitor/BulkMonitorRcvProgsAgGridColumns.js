import { GRID_LINE_HEIGHT } from '@/style_constants';
import React from 'react';
import RcvProgsBulkLogBtnRenderer from './components/RcvProgsBulkLogBtnRenderer';
import RcvProgsRenderer from './components/RcvProgsRenderer';

const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        headerName: '매체',
        field: 'orgSourceName',
        width: 150,
        cellClassRules,
    },
    {
        headerName: '기사 번호',
        field: 'contentId',
        width: 100,
        cellClassRules,
    },
    {
        headerName: '기사 제목',
        wrapText: true,
        field: 'title',
        flex: 1,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        tooltipField: 'title',
    },
    {
        headerName: 'IUD',
        field: 'iud',
        width: 60,
        cellClassRules,
    },
    {
        headerName: '상태',
        field: 'status',
        width: 100,
        cellRendererFramework: (params) => {
            const { data } = params;
            return <RcvProgsRenderer {...params} type="status" value={data.status} onClick={params.data.handleClickValue} />;
        },
    },
    {
        headerName: '사이트',
        field: 'site',
        children: [
            {
                headerName: '네이버',
                field: 'naverStatus',
                width: 100,
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} type="naver" value={data.naverStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '다음',
                field: 'daumStatus',
                width: 100,
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} type="daum" value={data.daumStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '네이트',
                field: 'nateStatus',
                width: 100,
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} type="nate" value={data.nateStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '줌',
                field: 'zoomStatus',
                width: 100,
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} type="zoom" value={data.zoomStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '언론재단',
                field: 'kpfStatus',
                width: 100,
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} type="kpf" value={data.kpfStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '기타',
                field: 'bulkLogBtn',
                width: 100,
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsBulkLogBtnRenderer {...params} onClick={data.handleClickBulkLog} />;
                },
            },
        ],
    },
];
