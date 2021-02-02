import React from 'react';
import RelationPollSortItemRenderer from '@pages/Survey/Poll/components/RelationPollSortItemRenderer';

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
        rowDragText: (params) => {
            console.log(params);
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
            return <RelationPollSortItemRenderer {...data} />;
        },
    },
];
