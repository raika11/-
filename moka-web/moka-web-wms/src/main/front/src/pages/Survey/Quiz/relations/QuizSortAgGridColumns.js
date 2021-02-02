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
            if (dragItemCount > 1) {
                const message = params.rowNodes ? params.rowNodes[0].data.title : '';
                return `${message} 외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.title;
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
    },
];
