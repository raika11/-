import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { MokaCard, MokaIcon, MokaIconTabs } from '@components';
import Button from 'react-bootstrap/Button';
import clsx from 'clsx';
import { Route, Switch } from 'react-router-dom';
import GroupEdit from '@pages/Group/GroupEdit';
import GroupChildGroupMemberEdit from '@pages/Group/relations/GroupChildGroupMemberEdit';

const MemberGroupList = React.lazy(() => import('./GroupList'));

const Group = () => {
    const handleAdd = () => {};

    return (
        <div className="d-flex">
            <Helmet>
                <title>사용자 그룹관리</title>
                <meta name="description" content="사용자 그룹관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            {/*리스트*/}
            <MokaCard
                className="mb-0 mr-10"
                height={CARD_DEFAULT_HEIGHT}
                headerClassName="d-flex justify-content-between align-item-center"
                title="사용자 그룹관리"
                titleClassName="h-100 mb-0 pb-0"
                width={480}
            >
                <div className="mb-3 d-flex justify-content-end">
                    <Button variant="dark" onClick={handleAdd}>
                        추가
                    </Button>
                </div>
                <MemberGroupList />
            </MokaCard>
            <Switch>
                <Route
                    path={['/group', '/group/:grpCd']}
                    exact
                    render={() => (
                        <>
                            {/* 탭 */}
                            <MokaIconTabs
                                //expansion={expansionState[2]}
                                //onExpansion={handleTabExpansion}
                                tabWidth={1000}
                                height={CARD_DEFAULT_HEIGHT}
                                tabs={[
                                    <Suspense>
                                        <GroupEdit />
                                    </Suspense>,
                                    <Suspense>
                                        <GroupChildGroupMemberEdit />
                                    </Suspense>,
                                    <Suspense>
                                        <MokaCard title="메뉴 권한">
                                            <MemberGroupList />
                                        </MokaCard>
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '사이트 정보', text: 'Info' },
                                    { title: '페이지 검색', icon: <MokaIcon iconName="fal-file" /> },
                                    { title: '콘텐츠 스킨 검색', icon: <MokaIcon iconName="fal-file-alt" /> },
                                ]}
                            />
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Group;
