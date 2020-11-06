
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { MokaCard, MokaIcon, MokaIconTabs } from '@components';
import Button from 'react-bootstrap/Button';
import clsx from 'clsx';
import { Route, Switch } from 'react-router-dom';
import MemberGroupEdit from '@pages/Group/GroupEdit';

const MemberGroupList = React.lazy(() => import('./reporterMgrList'));

const MemberGroup = () => {
    const handleAdd = () => {};

    return (
        <div className="d-flex">
            <Helmet>
                <title>사용자 그룹관리</title>
                <meta name="description" content="사용자 그룹관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

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
                    path={['/member-group', '/memeber-group/:grpCd']}
                    exact
                    render={() => (
                        <>
                            <Suspense>
                                <MemberGroupEdit />
                            </Suspense>,
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default MemberGroup;
