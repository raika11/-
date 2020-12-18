import React, { Suspense, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs, MokaIcon } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { clearStore } from '@store/member';
import MemberChildMenuAuth from '@pages/Member/relations/MemberChildMenuAuth';
import { MokaLoader } from '@components';

const MemberList = React.lazy(() => import('./MemberLIst'));
const MemberEdit = React.lazy(() => import('./MemberEdit'));
const MemberChildLoginHistoryList = React.lazy(() => import('./relations/MemberChildLoginHistoryList'));

/**
 * 사용자 관리
 */
const Member = () => {
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
                <title>사용자 관리</title>
                <meta name="description" content="사용자 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                className="mb-0 mr-gutter"
                height={CARD_DEFAULT_HEIGHT}
                headerClassName="d-flex justify-content-between align-item-center"
                bodyClassName="d-flex flex-column"
                title="사용자 관리"
                titleClassName="mb-0"
                width={1016}
            >
                <Suspense>
                    <MemberList />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/member/add', '/member/:memberId']}
                    exact
                    render={() => (
                        <React.Fragment>
                            {/* 탭 */}
                            <MokaIconTabs
                                height={CARD_DEFAULT_HEIGHT}
                                tabWidth={520}
                                onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                                tabs={[
                                    <Suspense fallback={<MokaLoader />}>
                                        <MemberEdit />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <MemberChildLoginHistoryList show={activeTabIdx === 1} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <MemberChildMenuAuth />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '사용자 정보', text: 'Info' },
                                    { title: '로그인 이력', icon: <MokaIcon iconName="fal-history" /> },
                                    { title: '메뉴권한', icon: <MokaIcon iconName="fal-file-alt" /> },
                                ]}
                            />
                        </React.Fragment>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Member;
