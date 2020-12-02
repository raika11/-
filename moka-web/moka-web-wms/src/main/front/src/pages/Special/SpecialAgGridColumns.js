import React from 'react';
import UrlCopyButton from './components/UrlCopyButton';
import CmsTagCopyButton from './components/CmsTagCopyButton';
import UrlConfirmButton from './components/UrlConfirmButton';
import SpecialEditButton from './components/SpecialEditButton';

export const columnDefs = [
    {
        headerName: '번호',
        field: 'cdNo',
        width: 60,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'cdNo',
    },
    {
        headerName: '페이지 코드',
        field: 'pageCd',
        width: 100,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'pageCd',
    },
    {
        headerName: '제목',
        field: 'pageTitle',
        width: 250,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'pageTitle',
    },
    {
        headerName: '게시일',
        field: 'modDt',
        width: 100,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'modDt',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 120,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'regDt',
    },
    {
        headerName: '리스트 노출',
        field: 'listYn',
        width: 90,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '사용여부',
        field: 'usedYn',
        width: 80,
        cellStyle: { fontSize: '12px' },
    },
    // {
    //     headerName: '',
    //     field: 'urlCopy',
    //     width: 90,
    //     cellStyle: { fontSize: '12px' },
    //     cellRendererFramework: (row) => {
    //         const { data } = row;
    //         return <UrlCopyButton {...row} data={data} />;
    //     },
    // },
    // {
    //     headerName: '',
    //     field: 'cmsTagCopy',
    //     width: 150,
    //     cellStyle: { fontSize: '12px' },
    //     cellRendererFramework: (row) => {
    //         const { data } = row;
    //         return <CmsTagCopyButton {...row} data={data} />;
    //     },
    // },
    // {
    //     headerName: '',
    //     field: 'urlConfirm',
    //     width: 90,
    //     cellStyle: { fontSize: '12px' },
    //     cellRendererFramework: (row) => {
    //         const { data } = row;
    //         return <UrlConfirmButton {...row} data={data} />;
    //     },
    // },
    // {
    //     headerName: '',
    //     field: 'edit',
    //     width: 80,
    //     cellStyle: { fontSize: '12px' },
    //     cellRendererFramework: (row) => {
    //         const { data } = row;
    //         return <SpecialEditButton {...row} data={data} />;
    //     },
    // },
];

export const rowData = [
    {
        cdNo: '432',
        pageCd: '디지털AD',
        pageTitle: '달콤한 휴식을 할 수 있는 여행자가 갖춰야할 조건',
        modDt: '2020-09-09',
        regDt: '2020-09-09',
        listYn: 'N',
        usedYn: 'Y',
    },
];
