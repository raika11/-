/**
 * <pre>
 *
 * 2020-10-08 thkim 최초생성
 * </pre>
 *
 * @since 2020-10-08 오후 2:00
 * @author thkim
 */
import React, { useState, useCallback, useEffect, Suspense } from 'react';
import Container from 'react-bootstrap/Container';

import { Route, Switch } from 'react-router-dom';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { useHistory } from 'react-router-dom';

const DomainEdit = React.lazy(() => import('./DomainEdit'));
const DomainList = React.lazy(() => import('./DomainList'));

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
                    buttons={[
                        {
                            variant: 'dark',
                            className: 'mr-05',
                            text: '도메인 추가',
                            style: { width: '100px', height: '32px' },
                            onClick: domainAdd,
                        },
                    ]}
                    width={480}
                >
                    <div>
                        <DomainList />
                    </div>
                </MokaCard>

                {/* 탭 */}
                <MokaCard className="mr-10 mb-0" headerClassName="d-flex justify-content-between align-item-center" title="도메인 추가" height={CARD_DEFAULT_HEIGHT} width={820}>
                    <Switch>
                        <Route path={['/domain', '/domain/:domainId']} exact render={() => <DomainEdit />} />
                    </Switch>
                </MokaCard>
            </div>
        </Container>
    );
};

export default Domain;
