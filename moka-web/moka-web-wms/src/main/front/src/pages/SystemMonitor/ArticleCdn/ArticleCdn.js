import React, { Suspense } from 'react';
// import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';

import ArticleCdnEdit from './ArticleCdnEdit';
const ArticleCdnList = React.lazy(() => import('./ArticleCdnList'));

/**
 * 트래픽 분산(기사) 관리
 */
const ArticleCdn = ({ match, displayName }) => {
    // const dispatch = useDispatch();

    return (
        <div className="d-flex">
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={800} className="mr-gutter" title={displayName} bodyClassName="d-flex flex-column">
                <Suspense>
                    <ArticleCdnList match={match} />
                </Suspense>
            </MokaCard>

            {/* 등록/수정 */}
            <Route path={[`${match.path}/add`, `${match.path}/:totalId`]} exact render={() => <ArticleCdnEdit match={match} />} />
        </div>
    );
};

export default ArticleCdn;
