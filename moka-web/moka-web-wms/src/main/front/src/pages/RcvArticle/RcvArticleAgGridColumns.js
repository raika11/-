import React from 'react';
import RcvArticleRegisterBtn from './components/RcvArticleRegisterBtn';
import RcvArticlePreviewBtn from './components/RcvArticlePreviewBtn';
import TitleRenderer from '@pages/Article/components/TitleRenderer';

const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        headerName: '월일',
        field: 'rcvDt',
        width: 48,
        cellClassRules,
    },
    {
        headerName: '수신',
        field: 'rcvTime',
        width: 48,
        cellClassRules,
    },
    {
        headerName: '구분',
        field: 'sourceName',
        width: 80,
        cellRendererFramework: ({ data }) => (
            <div
                className="h-100 d-flex align-items-center"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (data.serviceUrl) {
                        window.open(data.serviceUrl);
                    }
                }}
            >
                {data.sourceName}
            </div>
        ),
    },
    {
        headerName: '보기',
        field: 'preview',
        width: 55,
        cellRendererFramework: RcvArticlePreviewBtn,
    },
    {
        headerName: '제목',
        field: 'title',
        flex: 1,
        tooltipField: 'title',
        cellRendererFramework: TitleRenderer,
    },
    {
        headerName: '입력',
        field: 'serviceTime',
        width: 48,
        cellClassRules: {
            'text-positive': () => true,
            'ag-center-cell': () => true,
        },
    },
    {
        headerName: '기능',
        field: 'register',
        width: 55,
        cellClassRules,
        cellRendererFramework: RcvArticleRegisterBtn,
    },
];
