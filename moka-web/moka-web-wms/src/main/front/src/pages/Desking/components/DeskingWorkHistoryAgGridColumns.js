import React from 'react';

export default [
    {
        headerName: 'No',
        field: 'histSeq',
        width: 60,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기사 ID',
        field: 'contentId',
        width: 75,
        cellStyle: { fontSize: '12px', textAlign: 'center' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return data.parentContentId ? <p style={{ color: 'blue' }}>└</p> : data.contentId;
        },
    },
    {
        headerName: '제  목',
        field: 'title',
        width: 565,
        tooltipField: 'title',
        flex: 1,
        cellStyle: { fontSize: '12px' },
    },
];
