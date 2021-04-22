import React from 'react';
import RelationPollSortItemRenderer from '@pages/Survey/Poll/components/RelationPollSortItemRenderer';

const suppressKeyboardEvent = () => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        rowDragText: (params) => params.rowNode.data.item.title,
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'item',
        width: 400,
        flex: 1,
        suppressKeyboardEvent: suppressKeyboardEvent,
        cellRendererFramework: ({ data }) => {
            return <RelationPollSortItemRenderer {...data} />;
        },
        cellStyle: {
            paddingLeft: '0px',
            paddingRight: '0px',
        },
    },
];
