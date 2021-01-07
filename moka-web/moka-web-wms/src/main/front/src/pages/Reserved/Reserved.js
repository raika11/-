import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { MokaCard } from '@components';
import { GET_RESERVED, SAVE_RESERVED, DELETE_RESERVED } from '@store/reserved';
import ReservedEdit from './ReservedEdit';
const ReservedList = React.lazy(() => import('./ReservedList'));

/**
 * 예약어 관리 컴포넌트
 */
const Reserved = ({ match }) => {
    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_RESERVED] || store.loading[SAVE_RESERVED] || store.loading[DELETE_RESERVED],
    }));

    return (
        <div className="d-flex">
            <Helmet>
                <title>예약어관리</title>
                <meta name="description" content="예약어관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 예약어 목록 */}
            <MokaCard width={412} className="mr-gutter" bodyClassName="d-flex flex-column" title="예약어 검색">
                <Suspense>
                    <ReservedList />
                </Suspense>
            </MokaCard>

            {/* 예약어 정보 */}
            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:reservedSeq`]}
                    exact
                    render={() => (
                        <MokaCard width={780} title="예약어 정보" loading={loading}>
                            <ReservedEdit />
                        </MokaCard>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Reserved;
