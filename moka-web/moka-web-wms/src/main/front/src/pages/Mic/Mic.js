import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { MokaCard, MokaIcon, MokaIconTabs, MokaLoader } from '@/components';
import MicAgendaEdit from './MicAgendaEdit';
const AgendaList = React.lazy(() => import('./MicAgendaList'));
const MicFeedList = React.lazy(() => import('./MicFeedList'));
const MicPostList = React.lazy(() => import('./MicPostList'));

/**
 * 시민 마이크
 */
const Mic = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>시민 마이크</title>
                <meta name="description" content="시민 마이크 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 아젠다 목록 */}
            <MokaCard title="아젠다 목록" width={670} bodyClassName="d-flex flex-column" className="mr-gutter">
                <Suspense>
                    <AgendaList match={match} />
                </Suspense>
            </MokaCard>

            {/* 아젠다 상세 */}
            <Route
                path={[`${match.path}/add`, `${match.path}/:agndSeq`]}
                exact
                render={() => (
                    <MokaIconTabs
                        className="flex-fill"
                        tabs={[
                            <MicAgendaEdit match={match} />,
                            <Suspense fallback={<MokaLoader />}>
                                <MicFeedList />
                            </Suspense>,
                            <Suspense fallback={<MokaLoader />}>
                                <MicPostList />
                            </Suspense>,
                        ]}
                        tabNavs={[
                            { title: '아젠다', text: 'Info' },
                            { title: '피드 목록', icon: <MokaIcon iconName="fal-comment-alt-lines" /> },
                            { title: '포스트 목록', icon: <MokaIcon iconName="fal-comment-alt" /> },
                        ]}
                        foldable={false}
                    />
                )}
            />
        </div>
    );
};

export default Mic;
