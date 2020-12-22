import React, { useState, Suspense, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIcon, MokaLoader } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_TP } from '@/constants';

const RcvArticleList = React.lazy(() => import('./RcvArticleList'));
const RcvArticleEdit = React.lazy(() => import('./RcvArticleEdit'));

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

            <Route
                path={[`${match.url}/:totalId`]}
                exact
                render={() => (
                    <Suspense>
                        <RcvArticleEdit />
                    </Suspense>
                )}
            />
        </div>
    );
};

export default RcvArticle;
