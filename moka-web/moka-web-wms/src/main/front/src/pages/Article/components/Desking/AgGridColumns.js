import React from 'react';
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
            lineHeight: '48px',
        },
    },
    {
        headerName: 'ID\n기사유형',
        width: 83,
        // width: 93,
        field: 'artIdType',
        cellStyle: {
            whiteSpace: 'pre-wrap',
            lineHeight: '20px',
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            paddingTop: '3px',
        },
        tooltipField: 'artTypeName',
        cellClass: 'user-select-text',
    },
    {
        headerName: '사진',
        width: 73,
        field: 'artThumb',
        cellStyle: {
            paddingTop: '3px',
            paddingBottom: '3px',
        },
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
        autoHeight: true,
        tooltipField: 'artTitle',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            height: '48px',
            display: '-webkit-box',
            paddingTop: '4px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
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
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre',
        },
    },
    {
        headerName: '출고시간\n수정시간',
        width: 92,
        field: 'articleDt',
        cellClassRules: {
            'pre-wrap-cell': () => true,
        },
        cellStyle: { lineHeight: '20px' },
    },
    {
        headerName: '기자명',
        width: 95,
        field: 'reportersText',
        tooltipField: 'artReporter',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
    },
];
