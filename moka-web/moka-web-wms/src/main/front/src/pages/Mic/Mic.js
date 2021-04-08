import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { clearStore } from '@store/mic';
import { clearStore as clearPollStore, getPollGroupCodes } from '@store/survey/poll/pollAction';
import { MokaCard, MokaIcon, MokaIconTabs } from '@components';
import MicAgendaList from './MicAgendaList';
import MicAgendaEdit from './MicAgendaEdit';
import MicFeedList from './MicFeedList';
import MicPostList from './MicPostList';

/**
 * 시민 마이크
 */
const Mic = ({ match }) => {
    const dispatch = useDispatch();
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    useEffect(() => {
        dispatch(getPollGroupCodes());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
            dispatch(clearPollStore());
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
                <MicAgendaList match={match} />
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
                                <MicFeedList show={activeTabIdx === 1} />,
                                <MicPostList show={activeTabIdx === 2} />,
                            ]}
                            tabNavs={[
                                { title: '아젠다', text: 'Info' },
                                !isAddPage && { title: '피드 목록', icon: <MokaIcon iconName="fal-comment-alt-lines" /> },
                                !isAddPage && { title: '포스트 목록', icon: <MokaIcon iconName="fal-comment-alt" /> },
                            ].filter(Boolean)}
                            foldable={false}
                            hasHotkeys
                        />
                    );
                }}
            />
        </div>
    );
};

export default Mic;
