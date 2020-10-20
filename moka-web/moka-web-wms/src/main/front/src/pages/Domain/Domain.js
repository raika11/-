import React, { useState, Suspense } from 'react';
import Container from 'react-bootstrap/Container';

import { Route, Switch, useHistory } from 'react-router-dom';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';

const DomainEdit = React.lazy(() => import('./DomainEdit'));
const DomainList = React.lazy(() => import('./DomainList'));

/**
 * 도메인 관리
 */
const Domain = () => {
    const [expansionState, setExpansionState] = useState([true]);
    const history = useHistory();
    const domainAdd = () => {
        history.push('/domain');
    };

    return (
        <Container className="p-0" fluid>
            <div className="d-flex">
                {/* 리스트 */}
                <MokaCard
                    className="mb-0 mr-10"
                    height={CARD_DEFAULT_HEIGHT}
                    expansion={expansionState[0]}
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
        </Container>
    );
};

export default Domain;
