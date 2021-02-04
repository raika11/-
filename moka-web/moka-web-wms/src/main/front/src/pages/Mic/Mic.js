import React, { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { MokaCard, MokaIcon, MokaIconTabs } from '@/components';
import MicAgendaEdit from './MicAgendaEdit';
import MicFeedList from './MicFeedList';
import MicPostList from './MicPostList';
const AgendaList = React.lazy(() => import('./MicAgendaList'));

/**
 * 시민 마이크
 */
const Mic = ({ match }) => {
    const [activeTabIdx, setActiveTabIdx] = useState(0);

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
                        onSelectNav={(idx) => setActiveTabIdx(idx)}
                        tabs={[<MicAgendaEdit show={activeTabIdx === 0} match={match} />, <MicFeedList show={activeTabIdx === 1} />, <MicPostList show={activeTabIdx === 2} />]}
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
