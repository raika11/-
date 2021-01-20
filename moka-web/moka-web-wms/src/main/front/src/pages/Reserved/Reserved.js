import React, { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory } from 'react-router-dom';
import { MokaCard } from '@components';
import { GET_RESERVED, SAVE_RESERVED, DELETE_RESERVED } from '@store/reserved';
import toast, { messageBox } from '@utils/toastUtil';
import { deleteReserved, clearStore } from '@store/reserved';

import ReservedEdit from './ReservedEdit';
const ReservedList = React.lazy(() => import('./ReservedList'));

/**
 * 예약어 관리 컴포넌트
 */
const Reserved = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_RESERVED] || loading[SAVE_RESERVED] || loading[DELETE_RESERVED]);

    /**
     * 삭제 버튼
     * @params {object} 예약어
     */
    const handleClickDelete = (reserved) => {
        if (reserved.usedYn === 'Y') {
            messageBox.alert('사용중인 값입니다\n삭제할 수 없습니다');
        } else {
            messageBox.confirm(
                '선택하신 예약어를 삭제하시겠습니까?',
                () => {
                    dispatch(
                        deleteReserved({
                            callback: (response) => {
                                toast.result(response);
                                if (response.header.success) {
                                    history.push(match.path);
                                }
                            },
                            reservedSet: {
                                domainId: reserved.domain?.domainId,
                                reservedSeq: reserved.reservedSeq,
                            },
                        }),
                    );
                },
                () => {},
            );
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>예약어 관리</title>
                <meta name="description" content="예약어 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 예약어 목록 */}
            <MokaCard width={412} className="mr-gutter" bodyClassName="d-flex flex-column" title="예약어 검색">
                <Suspense>
                    <ReservedList match={match} onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            {/* 예약어 정보 */}
            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:reservedSeq`]}
                    exact
                    render={() => (
                        <MokaCard width={780} title="예약어 정보" loading={loading}>
                            <ReservedEdit match={match} onDelete={handleClickDelete} />
                        </MokaCard>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Reserved;
