import React from 'react';
import { QuestionsInfoAddButtonRenderer, QuestionsPreviewRenderer } from './ModalGridRenderer';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '',
        colId: 'button',
        width: 100,
        field: 'questionsInfo',
        cellRendererFramework: ({ value }) => <QuestionsInfoAddButtonRenderer questionsInfo={value} />,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: 'ID',
        field: 'repoterSeq',
        width: 10,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '퀴즈제명',
        field: 'repoterSeq',
        width: 250,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '작업자',
        field: 'Type',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'Type',
    },
    {
        headerName: '상태',
        field: 'questionsPriviewInfo',
        width: 100,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'title',
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
