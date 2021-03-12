import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { clearStore } from '@store/mic';
import { MokaCard, MokaIcon, MokaIconTabs, MokaLoader } from '@components';
import MicAgendaEdit from './MicAgendaEdit';
const AgendaList = React.lazy(() => import('./MicAgendaList'));
const MicFeedList = React.lazy(() => import('./MicFeedList'));
const MicPostList = React.lazy(() => import('./MicPostList'));

/**
 * 시민 마이크
 */
const Mic = ({ match }) => {
    const dispatch = useDispatch();
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

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
                render={({ match: subMatch }) => {
                    const isAddPage = subMatch.url === `${match.path}/add`;

                    return (
                        <MokaIconTabs
                            className="flex-fill"
                            activeKey={activeTabIdx}
                            onSelectNav={(idx) => setActiveTabIdx(idx)}
                            tabs={[
                                <MicAgendaEdit match={match} setActiveTabIdx={setActiveTabIdx} />,
                                <Suspense fallback={<MokaLoader />}>
                                    <MicFeedList show={activeTabIdx === 1} />
                                </Suspense>,
                                <Suspense fallback={<MokaLoader />}>
                                    <MicPostList show={activeTabIdx === 2} />
                                </Suspense>,
                            ]}
                            tabNavs={[
                                { title: '아젠다', text: 'Info' },
                                !isAddPage && { title: '피드 목록', icon: <MokaIcon iconName="fal-comment-alt-lines" /> },
                                !isAddPage && { title: '포스트 목록', icon: <MokaIcon iconName="fal-comment-alt" /> },
                            ].filter((a) => a)}
                            foldable={false}
                            hasHotkeys={true}
                        />
                    );
                }}
            />
        </div>
    );
};

export default Mic;
