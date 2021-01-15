import React from 'react';

export default [
    {
        headerName: 'No',
        field: 'histSeq',
        width: 60,
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '기사 ID',
        field: 'contentId',
        width: 75,
        cellClassRules: {
            'ft-12': () => true,
        },
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
        headerName: '제  목',
        field: 'title',
        width: 565,
        tooltipField: 'title',
        flex: 1,
        cellClassRules: {
            'ft-12': () => true,
        },
    },
];
