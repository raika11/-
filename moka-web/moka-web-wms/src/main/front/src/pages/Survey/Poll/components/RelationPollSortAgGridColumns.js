import React from 'react';
import RelationPollSortItemRenderer from '@pages/Survey/Poll/components/RelationPollSortItemRenderer';

const suppressKeyboardEvent = () => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.item.title,
        cellStyle: { lineHeight: 'normal' },
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'item',
        width: 400,
        flex: 1,
        cellStyle: { lineHeight: 'normal' },
        suppressKeyboardEvent: suppressKeyboardEvent,
        cellRendererFramework: ({ data }) => {
            return <RelationPollSortItemRenderer {...data} />;
        },
    },
];
