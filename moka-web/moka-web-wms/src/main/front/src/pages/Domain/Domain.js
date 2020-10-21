import React, { Suspense } from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet';

const DomainEdit = React.lazy(() => import('./DomainEdit'));
const DomainList = React.lazy(() => import('./DomainList'));

/**
 * 도메인 관리
 */
const Domain = () => {
    const history = useHistory();
    /**
     * 도메인 추가
     */
    const domainAdd = () => {
        history.push('/domain');
    };

    return (
        <div className="d-flex">
            <Helmet>
                <title>도메인 관리</title>
                <meta name="description" content="도메인 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            {/* 리스트 */}
            <MokaCard
                className="mb-0 mr-10"
                height={CARD_DEFAULT_HEIGHT}
                headerClassName="d-flex justify-content-between align-item-center"
                title="도메인 관리"
                titleClassName="h-100 mb-0 pb-0"
                width={480}
            >
                <div className="mb-3 d-flex justify-content-end">
                    <Button variant="dark" className={clsx('p-0', 'mr-05')} onClick={domainAdd} style={{ width: '100px', height: '32px' }}>
                        도메인 추가
                    </Button>
                </div>
                <Suspense>
                    <DomainList />
                </Suspense>
            </MokaCard>

            {/* 탭 */}
            <MokaCard className="mr-10 mb-0" headerClassName="d-flex justify-content-between align-item-center" title="도메인 추가" height={CARD_DEFAULT_HEIGHT} width={820}>
                <Suspense>
                    <Switch>
                        <Route path={['/domain', '/domain/:domainId']} exact render={() => <DomainEdit />} />
                    </Switch>
                </Suspense>
            </MokaCard>
        </div>
    );
};

export default Domain;
