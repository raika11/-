import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import { QuestionsInfoAddButtonRenderer, QuestionsPreviewRenderer } from './ModalGridRenderer';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const columnDefs = [
    {
        headerName: '',
        colId: 'button',
        width: 100,
        field: 'questionsInfo',
        cellRendererFramework: ({ value }) => <QuestionsInfoAddButtonRenderer questionsInfo={value} />,
        cellStyle,
    },
    {
        headerName: '퀴즈명',
        field: 'quizTitle',
        width: 250,
        cellStyle,
    },
    {
        headerName: '유형',
        field: 'Type',
        width: 200,
        tooltipField: 'Type',
        cellStyle,
    },
    {
        headerName: '문항제목',
        field: 'questionsPriviewInfo',
        width: 200,
        flex: 1,
        cellRendererFramework: ({ value }) => <QuestionsPreviewRenderer questionsPriviewInfo={value} />,
        tooltipField: 'title',
        cellStyle,
    },
];
