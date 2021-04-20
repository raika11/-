const suppressKeyboardEvent = () => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => {
            return params.rowNode.data.title;
        },
        cellClass: 'ag-content-center-cell',
        valueSetter: () => true,
    },
    {
        field: 'info',
        width: 400,
        flex: 1,
        suppressKeyboardEvent: suppressKeyboardEvent,
        cellRenderer: 'itemRenderer',
        cellStyle: { fontSize: '12px', lineHeight: '40px', paddingTop: '7px', alignItems: 'center' },
        valueSetter: () => true,
    },
];
