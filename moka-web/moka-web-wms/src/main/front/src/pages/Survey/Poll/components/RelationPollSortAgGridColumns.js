import React from 'react';
import RelationPollSortItemRenderer from '@pages/Survey/Poll/components/RelationPollSortItemRenderer';

const suppressKeyboardEvent = (params) => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 24,
        suppressMenu: true,
        cellStyle: { lineHeight: 'normal' },
        rowDragText: (params) => {
            return params.rowNode.data.item.title;
        },
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
