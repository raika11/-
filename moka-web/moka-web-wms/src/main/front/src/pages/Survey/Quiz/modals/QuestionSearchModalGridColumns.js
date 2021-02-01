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
        headerName: '퀴즈명',
        field: 'repoterSeq',
        width: 250,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '유형',
        field: 'Type',
        width: 200,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'Type',
    },
    {
        headerName: '문항제목',
        field: 'questionsPriviewInfo',
        width: 200,
        flex: 1,
        cellRendererFramework: ({ value }) => <QuestionsPreviewRenderer questionsPriviewInfo={value} />,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'title',
    },
];
