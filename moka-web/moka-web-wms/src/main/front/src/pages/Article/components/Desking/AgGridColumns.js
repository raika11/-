import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import ArticleTableCopyBtn from '../ArticleTableCopyBtn';

export default [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes ? params.rowNodes[0].data.artTitle : params.rowNode.data.artTitle;
                return `${message}외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.artTitle;
        },
        cellClass: 'ag-content-center-cell',
    },
    {
        colId: 'checkbox',
        width: 28,
        maxWidth: 28,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
    },
    {
        headerName: '매체',
        width: 110,
        field: 'sourceName',
        tooltipField: 'sourceName',
        cellStyle: {
            lineHeight: `${GRID_LINE_HEIGHT.C[1]}px`,
        },
    },
    {
        headerName: 'ID\n기사유형',
        width: 83,
        field: 'artIdType',
        tooltipField: 'artTypeName',
        cellClassRules: {
            'user-select-text': () => true,
        },
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '사진',
        width: 73,
        field: 'artThumb',
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '',
        width: 30,
        maxWidth: 30,
        field: 'groupNumber',
        // 편집 그룹 + 동영상(OVP/YOUTUBE/둘다)
        cellRenderer: 'GroupNumberRenderer',
    },
    {
        headerName: '제목',
        field: 'artTitle',
        width: 186,
        flex: 1,
        tooltipField: 'artTitle',
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '',
        width: 34,
        maxWidth: 34,
        field: 'copy',
        cellRendererFramework: (params) => {
            const data = params.node.data;
            return (
                <div className="d-flex align-items-center justify-content-center h-100 w-100">
                    <ArticleTableCopyBtn artTitle={data.artTitle} artUrl={data.artUrl} />
                </div>
            );
        },
    },
    {
        headerName: '면/판',
        width: 50,
        field: 'myunPan',
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: {
            justifyContent: 'center',
        },
    },
    {
        headerName: '출고시간\n수정시간',
        width: 92,
        field: 'articleDt',
        cellClassRules: {
            'ag-prewrap-cell': () => true,
        },
        cellStyle: {
            lineHeight: `${GRID_LINE_HEIGHT.M}px`,
        },
    },
    {
        headerName: '기자명',
        width: 95,
        field: 'reportersText',
        tooltipField: 'artReporter',
        cellClassRules: {
            'ag-center-cell': () => true,
        },
    },
];
