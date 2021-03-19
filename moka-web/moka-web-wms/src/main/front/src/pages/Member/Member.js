import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs, MokaIcon } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { clearStore } from '@store/member';
import MemberChildMenuAuth from '@pages/Member/relations/MemberChildMenuAuth';
import MemberList from './MemberLIst';
import MemberEdit from './MemberEdit';
import MemberChildLoginHistoryList from './relations/MemberChildLoginHistoryList';

/**
 * 사용자 관리
 */
const Member = ({ match }) => {
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
            <MokaCard className="mr-gutter" height={CARD_DEFAULT_HEIGHT} bodyClassName="d-flex flex-column" title="사용자 관리" width={1016}>
                <MemberList />
            </MokaCard>

            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:memberId`]}
                    exact
                    render={() => (
                        <React.Fragment>
                            {/* 탭 */}
                            <MokaIconTabs
                                height={CARD_DEFAULT_HEIGHT}
                                tabWidth={520}
                                onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                                tabs={[<MemberEdit match={match} />, <MemberChildLoginHistoryList show={activeTabIdx === 1} />, <MemberChildMenuAuth />]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '사용자 정보', text: 'Info' },
                                    { title: '로그인 이력', icon: <MokaIcon iconName="fal-history" /> },
                                    { title: '메뉴권한', icon: <MokaIcon iconName="fal-file-alt" /> },
                                ]}
                                foldable={false}
                            />
                        </React.Fragment>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Member;
