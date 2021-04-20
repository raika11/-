import ItemRenderer from './ItemRenderer';

const suppressKeyboardEvent = () => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 32,
        rowDragText: (params) => params.rowNode.data.title,
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'ordNo',
        width: 28,
        maxWidth: 28,
        cellStyle: {
            paddingLeft: '0px',
        },
    },
    {
        field: 'item',
        width: 400,
        flex: 1,
        suppressKeyboardEvent,
        cellRendererFramework: ItemRenderer,
    },
];
