import React from 'react';
import { QuizSearchAddButtonRenderer } from './ModalGridRenderer';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '',
        colId: 'button',
        width: 100,
        field: 'quizInfo',
        cellRendererFramework: ({ value }) => <QuizSearchAddButtonRenderer quizInfo={value} />,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: 'ID',
        field: 'quizSeq',
        width: 10,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '퀴즈제목',
        field: 'title',
        width: 250,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'title',
    },
    {
        headerName: '작업자',
        field: 'regMemberInfo',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'regMemberInfo',
    },
    {
        headerName: '상태',
        field: 'quzStsText',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'quzStsText',
    },
];

export const tempRows = [
    {
        id: 123,
        title: '4. 퀴즈 제목입니다.',
        regMemberInfo: {
            memberId: 'ssc14',
            memberNm: 'ssc14',
        },
        quizSts: 'Y',
    },
    {
        id: 122,
        title: '3. 퀴즈 제목입니다.',
        regMemberInfo: {
            memberId: 'ssc14',
            memberNm: 'ssc14',
        },
        quizSts: 'Y',
    },
    {
        id: 121,
        title: '2. 퀴즈 제목입니다.',
        regMemberInfo: {
            memberId: 'ssc14',
            memberNm: 'ssc14',
        },
        quizSts: 'Y',
    },
    {
        id: 120,
        title: '1. 퀴즈 제목입니다.',
        regMemberInfo: {
            memberId: 'ssc14',
            memberNm: 'ssc14',
        },
        quizSts: 'Y',
    },
];
