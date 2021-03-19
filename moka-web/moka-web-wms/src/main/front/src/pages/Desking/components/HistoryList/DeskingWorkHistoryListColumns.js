import React from 'react';

export default [
    {
        headerName: 'No',
        field: 'histSeq',
        width: 60,
    },
    {
        headerName: '기사 ID',
        field: 'contentId',
        width: 75,
        cellRendererFramework: (row) => {
            const { data } = row;
            return data.parentContentId ? (
                <div className="d-flex justify-content-center">
                    <p className="text-info">└</p>
                </div>
            ) : (
                data.contentId
            );
        },
    },
    {
        headerName: '제목',
        field: 'title',
        width: 565,
        tooltipField: 'title',
        flex: 1,
    },
];
