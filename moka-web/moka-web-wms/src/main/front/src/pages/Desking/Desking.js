import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';

const DeskingList = React.lazy(() => import('./DeskingList'));
const DeskingWorkList = React.lazy(() => import('./DeskingWorkList'));
const DeskingTab = React.lazy(() => import('./DeskingTab'));

/**
 * 페이지편집
 */
const Desking = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>페이지편집</title>
                <meta name="description" content="페이지편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 데스킹 트리 */}
            <Suspense>
                <DeskingList />
            </Suspense>

            {/* 데스킹 워크 */}
            <Suspense>
                <DeskingWorkList />
            </Suspense>

            {/* 데스킹 탭 */}
            <Suspense>
                <DeskingTab />
            </Suspense>
        </div>
    );
};

export default Desking;
