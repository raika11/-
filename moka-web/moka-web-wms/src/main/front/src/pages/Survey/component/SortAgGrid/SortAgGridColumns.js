const suppressKeyboardEvent = () => true;

const replaceNo = (t) => ('00' + t).slice(-2);

export const columnDefs = [
    {
        rowDrag: true,
        width: 32,
        rowDragText: (params) => {
            return params.rowNode.data.title;
        },
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'id',
        width: 28,
        maxWidth: 28,
        cellStyle: {
            paddingLeft: '0px',
        },
        cellClass: 'ag-center-cell',
        valueGetter: (params) => replaceNo(params.node.data.id + 1),
    },
    {
        field: 'info',
        flex: 1,
        suppressKeyboardEvent: suppressKeyboardEvent,
        cellRenderer: 'itemRenderer',
        valueSetter: () => true,
        cellStyle: {
            paddingLeft: '0px',
            paddingRight: '0px',
        },
    },
];
