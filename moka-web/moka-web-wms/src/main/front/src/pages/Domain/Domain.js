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
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@moka/fontawesome-pro-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { MokaCardEditor, MokaCardToggleTabs, MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import Button from 'react-bootstrap/Button';
import { faAngleDoubleLeft } from '@moka/fontawesome-pro-light-svg-icons';
import { changeSearchOption, getDomains } from '@store/domain';

const DomainEdit = React.lazy(() => import('./DomainEdit'));

const Domain = () => {
    const [expansionState, setExpansionState] = useState([true]);
    const dispatch = useDispatch();

    const { detail, list, total, search, error, loading, latestMediaId } = useSelector((store) => ({
        detail: store.domain.detail,
        list: store.domain.list,
        total: store.domain.total,
        search: store.domain.search,
        error: store.domain.error,
        latestMediaId: store.auth.latestMediaId,
    }));

    useEffect(() => {
        dispatch(
            getDomains(
                changeSearchOption({
                    key: 'mediaId',
                    value: latestMediaId,
                }),
            ),
        );
    }, [latestMediaId, dispatch]);

    return (
        <Container className="p-0" fluid>
            <div className="d-flex">
                {/* 리스트 */}
                <MokaCard
                    className="mr-10"
                    height={CARD_DEFAULT_HEIGHT}
                    expansion={expansionState[0]}
                    headerClassName="d-flex justify-content-between align-item-center"
                    buttons={[
                        {
                            variant: 'dark',
                            className: 'mr-05',
                            text: '도메인 추가',
                            style: { width: '100px', height: '32px' },
                        },
                    ]}
                >
                    <div>AgGrid</div>
                </MokaCard>

                {/* 탭 */}
                <MokaCard className="mr-10 mb-0" headerClassName="d-flex justify-content-between align-item-center" title="도메인 추가" height={CARD_DEFAULT_HEIGHT} width={820}>
                    <Suspense>
                        <DomainEdit />
                    </Suspense>
                </MokaCard>
            </div>
        </Container>
    );
};

export default Domain;
