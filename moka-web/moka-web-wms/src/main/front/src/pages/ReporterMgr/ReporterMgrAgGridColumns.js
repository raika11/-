import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '동그라미',
        field: 'groupCd',
        cellStyle: { textAlign: 'center' },
        width: 65,
    },
    {
        headerName: '번호',
        field: 'groupCd',
        cellStyle: { textAlign: 'center' },
        width: 65,
    },
    {
        headerName: '아이디',
        field: 'groupNm',
        width: 75,
    },
    {
        headerName: '이름',
        field: 'groupKorNm',
        //cellStyle: { textAlign: 'center' },
        width: 95,
    },
    {
        headerName: '소속',
        field: 'regId',
        width: 60,
    },
    {
        headerName: '이메일',
        field: 'regDt', // 안나옴.
        width: 135,
    },
    {
        headerName: '노출',
        field: 'regDt', // 안나옴.
        width: 135,
    },
    {
        headerName: '기자페이지',
        field: 'regDt', // 안나옴.
        width: 135,
    },
];
