import React, { Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs, MokaLoader } from '@components';
import { Route } from 'react-router-dom';
import PollChildRelation from '@pages/Survey/Poll/relations/PollChildRelationInfo';
import { useDispatch } from 'react-redux';
import { getPollCategoryCodes, getPollGroupCodes } from '@store/survey/poll/pollAction';

const PollList = React.lazy(() => import('@pages/Survey/Poll/PollList'));
const PollEdit = React.lazy(() => import('@pages/Survey/Poll/PollEdit'));

const Poll = ({ match }) => {
    const dispatch = useDispatch();
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    useEffect(() => {
        dispatch(getPollCategoryCodes());
        dispatch(getPollGroupCodes());
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>투표 관리</title>
                <meta name="description" content="투표 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={950} className="mr-gutter" titleClassName="mb-0" title="투표 관리">
                <Suspense fallback={<MokaLoader />}>
                    <PollList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[`${match.url}/add`, `${match.url}/:voteSeq`]}
                exact
                render={(props) => (
                    <MokaIconTabs
                        foldable={false}
                        tabWidth={570}
                        onSelectNav={(idx) => setActiveTabIdx(idx)}
                        tabs={[
                            <Suspense fallback={<MokaLoader />}>
                                <PollEdit show={activeTabIdx === 0} />
                            </Suspense>,
                            <Suspense fallback={<MokaLoader />}>
                                <PollChildRelation show={activeTabIdx === 1} />
                            </Suspense>,
                        ]}
                        tabNavWidth={48}
                        placement="left"
                        tabNavs={[
                            { title: '투표 정보', text: 'Info' },
                            { title: '관련 정보페이지', text: '관련' },
                        ]}
                    />
                )}
            />
        </div>
    );
};

export default Poll;
