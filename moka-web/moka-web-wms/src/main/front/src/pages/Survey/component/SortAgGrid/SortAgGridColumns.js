import React from 'react';
import ItemRenderer from './ItemRenderer';

// 드래그 시 필요한 css 처리.
// 데스킹 메뉴 참고.
const cellClassRules = {
    'ag-rel-cell': (params) => params.data.rel === true,
    'ag-edit-cell': (params) => params.colDef.editable,
};

export const rowClassRules = {
    'ag-rel-row': (params) => false,
};

const suppressKeyboardEvent = (params) => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 24,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            return params.rowNode.data.item.title;
        },
        cellClassRules: cellClassRules,
    },
    {
        field: 'relOrdEx',
        width: 0,
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        field: 'item',
        width: 400,
        flex: 1,
        cellClassRules: cellClassRules,
        suppressKeyboardEvent: suppressKeyboardEvent,
        cellRendererFramework: ({ data }) => {
            return <ItemRenderer {...data} />;
        },
        cellStyle: { fontSize: '12px', lineHeight: '40px', paddingTop: '7px', alignItems: 'center' },
    },
];

export const tempRows = [
    {
        totalId: 1,
        title: '1번 제목 입니다.',
        url: 'https://news.joins.com/article/23982920',
    },
    {
        totalId: 2,
        title: '2번 제목 입니다.',
        url: 'https://news.joins.com/article/23982920',
    },
];
