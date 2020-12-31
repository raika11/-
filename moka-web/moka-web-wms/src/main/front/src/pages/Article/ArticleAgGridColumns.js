import React from 'react';
import { MokaIcon } from '@components';
import ArticleActionBtn from './components/ArticleActionBtn';
// import RcvArticlePreviewBtn from './components/RcvArticlePreviewBtn';
// import TitleRenderer from './components/TitleRenderer';

export default [
    {
        headerName: '매체/분류',
        colId: 'source',
        width: 150,
        cellStyle: { fontSize: '12px' },
        cellRendererFramework: ({ data }) => {
            return (
                <React.Fragment>
                    {data.bulkFlag === 'Y' && <MokaIcon iconName="fas-circle" className="color-info mr-1" />}
                    {data.sourceName} - {data.contentKorname}
                </React.Fragment>
            );
        },
    },
    {
        headerName: '보기',
        field: 'rcvTime',
        width: 100,
    },
    {
        headerName: '제목',
        field: 'artTitle',
        flex: 1,
        width: 100,
        tooltipField: 'artTitle',
        // cellRendererFramework: (row) => <TitleRenderer {...row} />,
    },
    {
        headerName: '면/판',
        field: 'myunPan',
        width: 50,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
    {
        headerName: '등록시간',
        field: 'regDt',
        width: 80,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
    {
        headerName: '기능',
        field: 'register',
        width: 135,
        cellRendererFramework: (row) => <ArticleActionBtn {...row} />,
    },
];
