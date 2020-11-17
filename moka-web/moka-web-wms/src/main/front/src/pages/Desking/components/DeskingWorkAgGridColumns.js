import React from 'react';
import { MokaTableDeleteButton, MokaTableEditButton } from '@components';

const cellClassRules = {
    'ag-rel-cell': (params) => params.data.rel === true,
    'ag-edit-cell': (params) => params.colDef.editable,
};

export const rowClassRules = {
    'ag-rel-row': (params) => params.data.rel === true,
};

export const columnDefs = [
    {
        rowDrag: true,
        width: 16,
        suppressMenu: true,
        cellClassRules: cellClassRules,
    },
    {
        field: 'relOrd',
        width: 0,
        colSpan: (params) => {
            return params.data.rel ? 2 : 1;
        },
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        colId: 'checkbox',
        width: 16,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellClassRules: cellClassRules,
    },
    {
        width: 0,
        field: 'relTitle',
        colSpan: (params) => {
            return params.data.rel ? 4 : 1;
        },
        editable: true,
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 20,
        field: 'contentOrd',
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 50,
        field: 'thumbFileName',
        cellRenderer: 'imageRenderer',
        cellClassRules: cellClassRules,
    },
    {
        width: 220,
        field: 'title',
        flex: 1,
        autoHeight: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '12px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        editable: true,
        wrapText: true,
        cellClassRules: cellClassRules,
    },
    {
        field: 'editButton',
        width: 30,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableEditButton {...row} onClick={data.onDelete} />;
        },
        cellRendererParams: (params) => {
            return {
                api: params.api,
                rowIndex: params.rowIndex,
                colKey: 'title',
                char: params.data.title,
            };
        },
        cellClassRules: cellClassRules,
    },
    {
        field: 'deleteButton',
        width: 30,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
        cellRendererParams: (params) => {
            return {
                name: 'delete',
                params,
            };
        },
        cellClassRules: cellClassRules,
    },
];

// export const getOverIndex = (event, tgt) => {
//     debugger;
//     const elements = document.elementsFromPoint(event.clientX, event.clientY);
//     const agGridRow = elements.find((r) => r.classList.contains('ag-row'));
//     if (agGridRow) {
//         const idOfRow = agGridRow.getAttribute('row-id');
//         const rowNode = tgt.api.getRowNode(idOfRow);
//         console.log('idOfRow:'+idOfRow+',rowIndex:'+rowNode.rowIndex);
//         return rowNode.rowIndex;
//     }
//     return -1;
// };
