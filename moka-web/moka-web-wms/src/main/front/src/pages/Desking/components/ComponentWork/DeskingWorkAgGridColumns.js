const cellClassRules = {
    'ag-rel-cell': (params) => params.data.rel === true,
    'ag-edit-cell': (params) => params.colDef.editable,
};

export const rowClassRules = {
    'ag-rel-row': (params) => params.data.rel === true,
};

const suppressKeyboardEvent = () => true;

// 기본 데스킹워크 컬럼 정의
export const columnDefs = [
    {
        rowDrag: true,
        width: 24,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes ? params.rowNodes[0].data.title : params.rowNode.data.title;
                return `${message} 외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.title;
        },
        cellClassRules: cellClassRules,
    },
    {
        field: 'relOrdEx',
        width: 0,
        colSpan: (params) => {
            return params.data.rel ? 2 : 0;
        },
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        colId: 'checkbox',
        width: 24,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellClassRules: cellClassRules,
    },
    {
        field: 'relTitle',
        width: 0,
        colSpan: (params) => {
            return params.data.rel ? 4 : 0;
        },
        cellRenderer: 'editor',
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
        suppressKeyboardEvent: suppressKeyboardEvent,
    },
    {
        field: 'contentOrdEx',
        width: 24,
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 50,
        field: 'irThumbFileName',
        cellRenderer: 'imageRenderer',
        cellClassRules: cellClassRules,
        cellStyle: { paddingTop: '3px', paddingBottom: '3px' },
    },
    {
        width: 200,
        field: 'title',
        flex: 1,
        autoHeight: true,
        cellRenderer: 'editor',
        cellClassRules: cellClassRules,
        suppressKeyboardEvent: suppressKeyboardEvent,
    },
];

// 네이버채널 컬럼 정의
export const naverChannelColumnDefs = [
    {
        rowDrag: true,
        width: 24,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.title,
    },
    {
        field: 'contentOrdEx',
        width: 24,
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 50,
        field: 'irThumbFileName',
        cellRenderer: 'imageRenderer',
        cellStyle: { paddingTop: '3px', paddingBottom: '3px' },
    },
    {
        width: 200,
        field: 'title',
        flex: 1,
        autoHeight: true,
        cellRenderer: 'editor',
        suppressKeyboardEvent: suppressKeyboardEvent,
    },
];
