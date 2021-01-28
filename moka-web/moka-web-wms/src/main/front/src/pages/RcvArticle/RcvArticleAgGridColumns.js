import React from 'react';
import RcvArticleRegisterBtn from './components/RcvArticleRegisterBtn';
import RcvArticlePreviewBtn from './components/RcvArticlePreviewBtn';
import TitleRenderer from '@pages/Article/components/TitleRenderer';

export default [
    {
        headerName: '월일',
        field: 'rcvDt',
        width: 45,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '수신',
        field: 'rcvTime',
        width: 45,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '구분',
        field: 'sourceName',
        width: 70,
        cellRendererFramework: ({ data }) => (
            <div
                className="h-100 d-flex align-items-center ft-12"
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
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: (row) => <RcvArticlePreviewBtn {...row} />,
    },
    {
        headerName: '제목',
        field: 'title',
        flex: 1,
        width: 100,
        tooltipField: 'title',
        wrapText: true,
        autoHeight: true,
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: (row) => <TitleRenderer {...row} inRcv />,
    },
    {
        headerName: '입력',
        field: 'serviceTime',
        width: 45,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        cellClassRules: {
            'text-positive': () => true,
        },
    },
    {
        headerName: '기능',
        field: 'register',
        width: 55,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: RcvArticleRegisterBtn,
    },
];
