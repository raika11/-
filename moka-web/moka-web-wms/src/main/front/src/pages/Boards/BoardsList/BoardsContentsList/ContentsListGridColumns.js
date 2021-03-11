import React from 'react';
import FileItemRenderer from './FileItemRenderer';

export const ColumnDefs = [
    {
        headerName: '번호',
        field: 'boardSeq',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 70,
    },
    {
        headerName: '구분',
        field: 'channelName',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 100,
    },
    {
        headerName: '지역',
        field: 'title',
        width: 250,
        flex: 1,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '제목',
        field: 'title',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 120,
    },
    {
        headerName: '작성자',
        field: 'registItem',
        cellStyle: { fontSize: '12px', lineHeight: '18px' },
        width: 120,
    },
    {
        headerName: '작성일시',
        field: 'regDt',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 60,
    },
    {
        headerName: '조회',
        field: 'viewcount',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '첨부파일',
        field: 'fileItem',
        width: 80,
        cellRendererFramework: (params) => <FileItemRenderer attaches={params.value.attaches} />,
    },
    // {
    //     headerName: '추천/비추천',
    //     field: 'viewcount',
    //     width: 80,
    //     cellStyle: { display: 'flex', alignItems: 'center' },
    // },
    // {
    //     headerName: '신고',
    //     field: 'viewcount',
    //     width: 80,
    //     cellStyle: { display: 'flex', alignItems: 'center' },
    // },
    {
        headerName: '노출',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
