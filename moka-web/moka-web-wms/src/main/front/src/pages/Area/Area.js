import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';

const AreaList = React.lazy(() => import('./AreaList'));
const AreaEdit = React.lazy(() => import('./AreaEdit'));

/**
 * 편집영역관리
 */
const Area = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>편집영역관리</title>
                <meta name="description" content="편집영역관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 편집영역 리스트 */}
            <Suspense>
                <AreaList match={match} />
            </Suspense>

            {/* 편집영역 등록/수정 */}
            <Suspense>
                <AreaEdit />
            </Suspense>
        </div>
    );
};

export default Area;
