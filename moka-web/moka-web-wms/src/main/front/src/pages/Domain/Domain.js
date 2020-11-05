import React, { Suspense } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { clearStore, deleteDomain, hasRelationList, GET_DOMAIN, SAVE_DOMAIN } from '@store/domain';
import { notification, toastr } from '@utils/toastUtil';

const DomainEdit = React.lazy(() => import('./DomainEditTest'));
const DomainList = React.lazy(() => import('./DomainList'));

/**
 * 도메인 관리
 */
const Domain = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_DOMAIN] || store.loading[SAVE_DOMAIN],
    }));

    /**
     * 도메인 추가
     */
    const handleAddClickDomain = () => {
        history.push('/domain');
    };

    /**
     * 도메인 삭제
     * @param {object} domain domain
     */
    const deleteCallback = (domain) => {
        toastr.confirm(`${domain.domainId}_${domain.domainName}을 정말 삭제하시겠습니까?`, {
            onOk: () => {
                dispatch(
                    deleteDomain({
                        domainId: domain.domainId,
                        callback: ({ header }) => {
                            // 삭제 성공
                            if (header.success) {
                                notification('success', header.message);
                                history.push('/domain');
                            }
                            // 삭제 실패
                            else {
                                notification('warning', header.message);
                            }
                        },
                    }),
                );
            },
            onCancel: () => {},
        });
    };

    /**
     * 삭제 버튼 클릭
     * @param {object} domain domain
     */
    const handleClickDelete = (domain) => {
        const { domainId } = domain;
        dispatch(
            hasRelationList({
                domainId,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 관련 아이템 없음
                        if (!body) deleteCallback(domain);
                        // 관련 아이템 있음
                        else notification('warning', '사용 중인 도메인은 삭제할 수 없습니다');
                    } else {
                        notification('warning', header.message);
                    }
                },
            }),
        );
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>도메인 관리</title>
                <meta name="description" content="도메인 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                className="mb-0 mr-gutter"
                height={CARD_DEFAULT_HEIGHT}
                headerClassName="d-flex justify-content-between align-item-center"
                title="도메인 관리"
                titleClassName="mb-0"
                width={480}
            >
                <div className="mb-3 d-flex justify-content-end">
                    <Button variant="dark" className={clsx('p-0', 'mr-05')} onClick={handleAddClickDomain} style={{ width: '100px', height: '32px' }}>
                        도메인 추가
                    </Button>
                </div>
                <Suspense>
                    <DomainList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            {/* 도메인 정보 */}
            <MokaCard
                title="도메인 추가"
                width={820}
                titleClassName="mb-0"
                headerClassName="d-flex justify-content-between align-item-center"
                height={CARD_DEFAULT_HEIGHT}
                loading={loading}
            >
                <Suspense>
                    <Switch>
                        <Route path={['/domain', '/domain/:domainId']} exact render={() => <DomainEdit onDelete={handleClickDelete} />} />
                    </Switch>
                </Suspense>
            </MokaCard>
        </div>
    );
};

export default Domain;
