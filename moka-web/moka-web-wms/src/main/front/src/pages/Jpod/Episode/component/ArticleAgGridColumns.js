// 드래그 시 필요한 css 처리.
// 데스킹 메뉴 참고.
const cellClassRules = {
    'ag-rel-cell': (params) => params.data.rel === true,
    'ag-edit-cell': (params) => params.colDef.editable,
};

export const rowClassRules = {
    'ag-rel-row': () => false,
};

const suppressKeyboardEvent = () => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 24,
        suppressMenu: true,
        rowDragText: (params) => {
            return params.rowNode.data.title;
        },
        cellClassRules: cellClassRules,
        valueSetter: () => true,
    },
    {
        field: 'info',
        width: 400,
        flex: 1,
        cellClassRules: cellClassRules,
        suppressKeyboardEvent: suppressKeyboardEvent,
        cellRenderer: 'itemRenderer',
        cellStyle: { fontSize: '12px', lineHeight: '40px', paddingTop: '7px', alignItems: 'center' },
        valueSetter: () => true,
    },
];
