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
        width: 30,
        maxWidth: 30,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes ? params.rowNodes[0].data.title : params.rowNode.data.title;
                return `${message} 외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.title;
        },
        cellClassRules: {
            ...cellClassRules,
            'ag-content-center-cell': () => true,
        },
    },
    {
        field: 'relOrdEx',
        width: 0,
        colSpan: (params) => {
            return params.data.rel ? 2 : 0;
        },
        cellClassRules: cellClassRules,
    },
    {
        colId: 'checkbox',
        width: 24,
        maxWidth: 24,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellStyle: {
            paddingLeft: '0px',
        },
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
        suppressKeyboardEvent: suppressKeyboardEvent,
    },
    {
        field: 'contentOrdEx',
        width: 25,
        maxWidth: 25,
        cellClassRules: cellClassRules,
    },
    {
        width: 42,
        field: 'irThumbFileName',
        cellRenderer: 'imageRenderer',
        cellRendererParams: { autoRatio: false },
        cellClassRules: cellClassRules,
        cellStyle: { paddingTop: '8px', paddingBottom: '8px' },
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
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.title,
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'contentOrdEx',
        width: 25,
        maxWidth: 25,
        cellClassRules: cellClassRules,
    },
    {
        width: 42,
        field: 'irThumbFileName',
        cellRenderer: 'imageRenderer',
        cellRendererParams: { autoRatio: false },
        cellStyle: { paddingTop: '8px', paddingBottom: '8px' },
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
