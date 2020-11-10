import React from 'react';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '동그라미',
        field: 'dayImg',
        cellStyle: { textAlign: 'center' },
        width: 65,
    },
    {
        headerName: '번호',
        field: 'repSeq',
        cellStyle: { textAlign: 'center' },
        width: 65,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        width: 75,
    },
    {
        headerName: '이름',
        field: 'repName',
        //cellStyle: { textAlign: 'center' },
        width: 95,
    },
    {
        headerName: '소속',
        field: 'r2CdNm',
        width: 60,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        width: 135,
    },
    {
        headerName: '노출',
        field: 'usedYn', // 안나옴.
        width: 135,
    },
    {
        headerName: '기자페이지',
        field: 'joinsBlog', // 안나옴.
        width: 135,
    },
];
