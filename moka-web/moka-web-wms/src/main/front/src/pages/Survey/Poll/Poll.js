import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaLoader } from '@components';
import { Route } from 'react-router-dom';

const PollList = React.lazy(() => import('@pages/Survey/Poll/PollList'));
const PollEdit = React.lazy(() => import('@pages/Survey/Poll/PollEdit'));

const Poll = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>투표 관리</title>
                <meta name="description" content="투표 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={1030} className="mr-gutter" titleClassName="mb-0" header={false}>
                <Suspense fallback={<MokaLoader />}>
                    <PollList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[`${match.url}/add`, `${match.url}/:voteSeq`]}
                exact
                render={(props) => (
                    <Suspense fallback={<MokaLoader />}>
                        <PollEdit />
                    </Suspense>
                )}
            />
        </div>
    );
};

export default Poll;
