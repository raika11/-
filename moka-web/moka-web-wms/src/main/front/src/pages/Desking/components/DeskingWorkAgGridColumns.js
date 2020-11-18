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
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes ? params.rowNodes[0].data.title : params.rowNode.data.title;
                return `${message} 외 [${dragItemCount - 1}건]`;
            }
            if (params.rowNode.data.rel) {
                return params.rowNode.data.relTitle;
            }
            return params.rowNode.data.title;
        },
        cellClassRules: cellClassRules,
    },
    {
        field: 'relOrdEx',
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
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
            rows: '2',
        },
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 20,
        field: 'contentOrdEx',
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 50,
        field: 'thumbFileName',
        cellRenderer: 'imageRenderer',
        cellClassRules: cellClassRules,
        cellStyle: { paddingTop: '1px', paddingBottom: '1px' },
    },
    {
        width: 100,
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
            paddingTop: '4px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
            rows: '2',
        },
        cellClassRules: cellClassRules,
        tooltipField: 'title',
    },
    {
        field: 'editButton',
        width: 25,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableEditButton {...row} onClick={data.onEdit} />;
        },
        cellClassRules: cellClassRules,
    },
    {
        field: 'deleteButton',
        width: 25,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
        cellClassRules: cellClassRules,
    },
];
