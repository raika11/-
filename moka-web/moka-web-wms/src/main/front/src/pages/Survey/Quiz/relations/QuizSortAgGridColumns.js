import React from 'react';
import ItemRenderer from './ItemRenderer';

const suppressKeyboardEvent = () => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.title,
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'relOrdEx',
        width: 0,
    },
    {
        field: 'item',
        width: 400,
        flex: 1,
        suppressKeyboardEvent: suppressKeyboardEvent,
        cellRendererFramework: ({ data }) => {
            return <ItemRenderer {...data} />;
        },
    },
];
