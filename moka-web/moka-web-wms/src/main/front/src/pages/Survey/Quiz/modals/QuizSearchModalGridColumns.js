import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import { QuizSearchAddButtonRenderer } from './ModalGridRenderer';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const columnDefs = [
    {
        headerName: '',
        colId: 'button',
        width: 60,
        field: 'quizInfo',
        cellRendererFramework: ({ value }) => <QuizSearchAddButtonRenderer quizInfo={value} />,
    },
    {
        headerName: 'ID',
        field: 'quizSeq',
        width: 50,
        cellStyle,
    },
    {
        headerName: '퀴즈제목',
        field: 'title',
        flex: 1,
        tooltipField: 'title',
        cellStyle,
    },
    {
        headerName: '작업자',
        field: 'regMemberInfo',
        width: 130,
        tooltipField: 'regMemberInfo',
        cellStyle,
    },
    {
        headerName: '상태',
        field: 'quzStsText',
        width: 80,
        tooltipField: 'quzStsText',
        cellStyle,
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
