import React from 'react';
import CodeMgtEditButton from './components/CodeMgtEditButton';

export default [
    {
        headerName: '그룹코드',
        field: 'grpCd',
        width: 160,
        tooltipField: 'grpCd',
    },
    {
        headerName: '그룹명',
        field: 'cdNm',
        width: 200,
        flex: 1,
        tooltipField: 'cdNm',
    },
    {
        headerName: '',
        field: 'edit',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <CodeMgtEditButton {...row} onClick={data.edit} data={data} />;
        },
    },
];
