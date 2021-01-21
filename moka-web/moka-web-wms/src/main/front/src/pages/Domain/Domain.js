import React, { Suspense } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { clearStore, deleteDomain, hasRelationList, GET_DOMAIN, SAVE_DOMAIN } from '@store/domain';
import toast, { messageBox } from '@utils/toastUtil';
import DomainEdit from './DomainEdit';
const DomainList = React.lazy(() => import('./DomainList'));

/**
 * 도메인 관리
 */
const Domain = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_DOMAIN] || store.loading[SAVE_DOMAIN],
    }));

    /**
     * 도메인 등록
     */
    const handleAddClickDomain = () => {
        history.push(`${match.path}/add`);
    };

    /**
     * 도메인 삭제
     * @param {object} domain domain
     */
    const deleteCallback = (domain) => {
        messageBox.confirm(
            '해당 도메인과 메인페이지가 삭제 됩니다',
            () => {
                dispatch(
                    deleteDomain({
                        domainId: domain.domainId,
                        callback: ({ header }) => {
                            // 삭제 성공
                            if (header.success) {
                                toast.success(header.message);
                                history.push(match.path);
                            }
                            // 삭제 실패
                            else {
                                toast.fail(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    /**
     * 삭제 버튼 클릭O
     * @param {object} domain domain
     */
    const handleClickDelete = (domain) => {
        const { domainId } = domain;
        dispatch(
            hasRelationList({
                domainId,
                callback: ({ header, body }) => {
                    if (header.success) {
                        if (!body) {
                            // 관련 아이템 없음
                            deleteCallback(domain);
                        } else {
                            // 관련 아이템 있음
                            messageBox.alert('해당 도메인은 사용페이지가 있어서 삭제할 수 없습니다', () => {});
                        }
                    } else {
                        toast.fail(header.message);
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
                <meta name="description" content="도메인 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                className="mb-0 mr-gutter"
                height={CARD_DEFAULT_HEIGHT}
                headerClassName="d-flex justify-content-between align-item-center"
                bodyClassName="d-flex flex-column"
                title="도메인 관리"
                width={480}
            >
                <div className="mb-2 d-flex justify-content-end">
                    <Button variant="positive" onClick={handleAddClickDomain}>
                        도메인 등록
                    </Button>
                </div>
                <Suspense>
                    <DomainList onDelete={handleClickDelete} match={match} />
                </Suspense>
            </MokaCard>

            {/* 도메인 정보 */}
            <Route
                path={[`${match.path}/add`, `${match.path}/:domainId`]}
                exact
                render={() => <DomainEdit onDelete={handleClickDelete} baseUrl={match.path} loading={loading} />}
            />
        </div>
    );
};

export default Domain;
