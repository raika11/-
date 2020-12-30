import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { clearStore } from '@store/rcvArticle';

import RcvArticleEdit from './RcvArticleEdit';
const RcvArticleList = React.lazy(() => import('./RcvArticleList'));

/**
 * 수신 기사 전체
 */
const RcvArticle = ({ match }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>수신 기사 전체</title>
                <meta name="description" content="수신 기사 전체 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={850} className="mr-gutter" bodyClassName="d-flex flex-column" header={false}>
                <Suspense>
                    <RcvArticleList />
                </Suspense>
            </MokaCard>

            <Route path={[`${match.url}/:rid`]} exact render={() => <RcvArticleEdit />} />
        </div>
    );
};

export default RcvArticle;
