import React from 'react';
import { MokaTableDeleteButton } from '@components';

const columnDefs = [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        rowDragText: (params) => params.rowNode.data.areaNm,
    },
    {
        headerName: '편집영역명',
        field: 'areaNm',
        width: 130,
        flex: 1,
        tooltipField: 'areaNm',
        cellStyle: { lineHeight: '34px', cursor: 'pointer' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 38,
        cellRenderer: 'usedYnRenderer',
        cellStyle: { lineHeight: '34px' },
    },
    {
        headerName: '',
        field: 'delete',
        width: 36,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];

export default columnDefs;
