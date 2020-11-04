import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '그룹코드',
        field: 'grpCd',
        //cellStyle: { textAlign: 'center' },
        width: 65,
    },
    {
        headerName: '그룹명',
        field: 'grpNm',
        // cellClass: 'ag-cell-center',
        //cellStyle: { textAlign: 'center' },
        width: 75,
    },
    {
        headerName: '그룹 한글명',
        field: 'grpKorNm',
        //cellStyle: { textAlign: 'center' },
        width: 95,
    },
    {
        headerName: '담당자',
        field: 'memNm',
        width: 60,
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        width: 135,
    },
];
