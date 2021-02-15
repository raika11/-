import React from 'react';
import RcvProgsBulkLogBtnRenderer from './components/RcvProgsBulkLogBtnRenderer';
import RcvProgsRenderer from './components/RcvProgsRenderer';

export default [
    {
        headerName: '매체',
        field: 'orgSourceName',
        width: 150,
        cellStyle: {},
    },
    {
        headerName: '기사 번호',
        field: 'contentId',
        width: 100,
        cellStyle: {},
    },
    {
        headerName: '기사 제목',
        wrapText: true,
        autoHeight: true,
        field: 'title',
        cellStyle: {},
        flex: 1,
        tooltipField: 'title',
    },
    {
        headerName: 'IUD',
        field: 'iud',
        width: 60,
        cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '상태',
        field: 'status',
        width: 130,
        cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '사이트',
        field: 'site',
        cellStyle: {},
        children: [
            {
                headerName: '네이버',
                field: 'naverStatus',
                width: 130,
                cellStyle: { textAlign: 'center' },
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} value={data.naverStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '다음',
                field: 'daumStatus',
                width: 130,
                cellStyle: { textAlign: 'center' },
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} value={data.daumStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '네이트',
                field: 'nateStatus',
                width: 130,
                cellStyle: { textAlign: 'center' },
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} value={data.nateStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '줌',
                field: 'zoomStatus',
                width: 130,
                cellStyle: { textAlign: 'center' },
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsRenderer {...params} value={data.zoomStatus} onClick={params.data.handleClickValue} />;
                },
            },
            {
                headerName: '기타',
                field: 'bulkLogBtn',
                width: 130,
                cellStyle: { textAlign: 'center' },
                cellRendererFramework: (params) => {
                    const { data } = params;
                    return <RcvProgsBulkLogBtnRenderer {...params} onClick={data.handleClickBulkLog} />;
                },
            },
        ],
    },
];
