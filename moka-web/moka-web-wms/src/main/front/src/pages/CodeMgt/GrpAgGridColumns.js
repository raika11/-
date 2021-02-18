import React from 'react';
import CodeMgtEditButton from './components/CodeMgtEditButton';

export default [
    {
        headerName: '그룹코드',
        field: 'grpCd',
        width: 130,
        tooltipField: 'grpCd',
        cellStyle: { lineHeight: '40px' },
    },
    {
        headerName: '그룹명',
        field: 'cdNm',
        width: 150,
        // wrapText: true,
        flex: 1,
        tooltipField: 'cdNm',
        // cellStyle: { lineHeight: '21px', boxSizing: 'border-box', display: '-webkit-box', '-webkit-line-clamp': 2, '-webkit-box-orient': 'vertical', overflow: 'hidden' },
        cellStyle: { lineHeight: '40px' },
    },
    {
        headerName: '작업자\n작업일시',
        field: 'worker',
        width: 125,
        wrapText: true,
        cellClassRules: {
            'pre-cell': () => true,
        },
        cellStyle: { lineHeight: '21px' },
    },
    {
        headerName: '',
        field: 'edit',
        width: 28,
        maxWidth: 28,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <CodeMgtEditButton {...row} onClick={data.edit} data={data} />;
        },
    },
];
