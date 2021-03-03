import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { MokaCard, MokaIcon, MokaIconTabs } from '@components';
import Button from 'react-bootstrap/Button';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/group';
import GroupChildMenuAuth from '@pages/Group/relations/GroupChildMenuAuth';
import { Col, Row } from 'react-bootstrap';
import GroupList from '@pages/Group/GroupList';
import GroupEdit from '@pages/Group/GroupEdit';
import GroupChildGroupMemberEdit from '@pages/Group/relations/GroupChildGroupMemberEdit';

// relations

/*const MemberGroupList = React.lazy(() => import('./GroupList'));
const GroupEdit = React.lazy(() => import('./GroupEdit'));
const GroupChildGroupMemberEdit = React.lazy(() => import('./relations/GroupChildGroupMemberEdit'));*/

/**
 * 그룹 관리
 */
const Group = ({ match }) => {
    // 히스토리셋팅
    const history = useHistory();
    const dispatch = useDispatch();

    // 마스터 그리드 클릭시 초기화 이벤트
    const handleClickAddGroup = () => {
        history.push(`${match.path}/add`);
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
                <meta name="description" content="사용자 그룹관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/*리스트*/}
            <MokaCard title="사용자 그룹관리" width={480} className="mr-gutter" bodyClassName="d-flex flex-column">
                <div className="mb-14 d-flex justify-content-end">
                    <Button variant="positive" onClick={handleClickAddGroup}>
                        등록
                    </Button>
                </div>
                <Suspense>
                    <GroupList />
                </Suspense>
            </MokaCard>
            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:groupCd`]}
                    exact
                    render={() => (
                        <MokaIconTabs
                            tabWidth={1050}
                            tabs={[
                                <MokaCard className="flex-fill w-100" bodyClassName="m-0 p-0" header={false}>
                                    <Row className="m-0">
                                        <Col xs={6} className="p-0">
                                            <GroupEdit match={match} />
                                        </Col>
                                        <Col xs={6} className="p-0">
                                            <GroupChildMenuAuth />
                                        </Col>
                                    </Row>
                                </MokaCard>,
                                <GroupChildGroupMemberEdit />,
                            ]}
                            tabNavWidth={48}
                            tabNavPosition="right"
                            tabNavs={[
                                { title: '그룹정보', text: 'Info' },
                                { title: '사용자 목록', icon: <MokaIcon iconName="fal-file-alt" /> },
                            ]}
                            foldable={false}
                        />
                    )}
                />
            </Switch>
        </div>
    );
};

export default Group;
