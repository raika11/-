import React, { useState, Suspense, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

import { Route, Switch } from 'react-router-dom';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { useHistory } from 'react-router-dom';
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
                    width={480}
                >
                    <div>
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
