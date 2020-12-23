import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';

import RcvArticleEdit from './RcvArticleEdit';
const RcvArticleList = React.lazy(() => import('./RcvArticleList'));

/**
 * 수신 기사 전체
 */
const RcvArticle = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div className="d-flex">
            <Helmet>
                <title>수신 기사 전체</title>
                <meta name="description" content="수신 기사 전체 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={850} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column" header={false}>
                <Suspense>
                    <RcvArticleList />
                </Suspense>
            </MokaCard>

            <Route path={[`${match.url}/:rid`]} exact render={() => <RcvArticleEdit />} />
        </div>
    );
};

export default RcvArticle;
