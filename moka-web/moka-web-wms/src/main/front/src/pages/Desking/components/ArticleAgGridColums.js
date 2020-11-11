import React from 'react';

export default [
    {
        rowDrag: true,
        width: 22,
        supressMenu: true,
        rowDragText: (params, dragItemCount) => {
            // if (dragItemCount > 1) {
            //     const message = params.rowNodes
            //         ? params.rowNodes.reduce(
            //               (prev, next) => `${prev.data.title},${next.data.title}`
            //           )
            //         : params.rowNode.data.title;
            //     return `${message}외 [${dragItemCount - 1}건]`;
            // }
            // return params.rowNode.data.contentsId;
            return '기사 정보 노출';
        },
    },
    {
        colId: 'checkbox',
        width: 28,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellClass: 'checkbox',
    },
    {
        headerName: '등록일시\n수정일시',
        field: 'cellDate',
        width: 75,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre-wrap',
            lineHeight: '20px',
            height: '50px',
        },
        sort: 'desc',
        // sortable: true,
        // unSortIcon: true,
        // comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
        //     return nodeA.data.distYmdt - nodeB.data.distYmdt;
        // }
    },
    {
        headerName: '',
        width: 28,
        // 편집 그룹 + 동영상(OVP/YOUTUBE/둘다)
    },
    {
        headerName: '제 목',
        field: 'title',
        width: 300,
        flex: 1,
        autoHeight: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '사진',
        width: 60,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cellRenderer: (params) => {
            let tag = '';
            if (params.data.thumbnailFileName) {
                tag += '<span style="width: 60px; height: 48px; display: flex; align-items: center;">';
                tag += `<img width="60" src="http://img.com/${params.data.thumbnailFileName}" />`;
                tag += '</span>';
            }
            return tag;
        },
    },
    {
        headerName: '출처\n카테고리',
        width: 100,
    },
    {
        headerName: '배부시간\n배부채널',
        width: 90,
    },
];
