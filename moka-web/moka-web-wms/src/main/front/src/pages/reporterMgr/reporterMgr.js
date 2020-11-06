import React, { useState, Suspense } from 'react';
import Helmet from 'react-helmet';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { MokaCard, MokaIcon, MokaIconTabs } from '@components';
import Button from 'react-bootstrap/Button';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearStore} from "@store/reporterMgr";
import toast, {notification, toastr} from "@utils/toastUtil";
// relations

const MemberGroupList = React.lazy(() => import('./GroupList'));
const GroupEdit = React.lazy(() => import('./GroupEdit'));
const GroupChildGroupMemberEdit = React.lazy(() => import('./relations/GroupChildGroupMemberEdit'));



const Group = () => {
// 히스토리셋팅
    const history = useHistory();
    const dispatch = useDispatch();

// 마스터 그리드 클릭시 초기화 이벤트
    const handleClickAddGroup = (e) => {
        history.push('/group');
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>사용자 그룹관리</title>
                <meta name="description" content="사용자 그룹관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            {/*리스트*/}
            <MokaCard
                title="사용자 그룹관리"
                width={480}
                titleClassName="h-100 mb-0 pb-0"
                headerClassName="d-flex justify-content-between align-item-center"
                className="mb-0 mr-10"
                height={CARD_DEFAULT_HEIGHT}
            >
                <div className="mb-3 d-flex justify-content-end">
                    <Button variant="dark" onClick={handleClickAddGroup}>
                        그룹 추가
                    </Button>
                </div>
                <Suspense>
                    <MemberGroupList />
                </Suspense>
            </MokaCard>
            <Switch>
                <Route
                    path={['/group', '/group/:groupCd']}
                    exact render={() => (
                    <>
                        <MokaIconTabs
                            //expansion={expansionState[2]}
                            //onExpansion={handleTabExpansion}
                            tabWidth={1000}
                            height={CARD_DEFAULT_HEIGHT}
                            tabs={[
                                <Suspense>
                                    <GroupEdit/>
                                </Suspense>
                                ,
                                <Suspense>
                                    <GroupChildGroupMemberEdit />
                                </Suspense>
                                /*
                                ,
                                <Suspense>
                                    <MokaCard title="메뉴 권한">
                                        <MemberGroupList />
                                    </MokaCard>
                                </Suspense>,
                                 */
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