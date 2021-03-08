import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import SpecialEdit from './SpecialEdit';
import { clearStore } from '@store/special';
const SpecialList = React.lazy(() => import('./SpecialList'));

/**
 * 디지털 스페셜 관리
 */
const Special = ({ match }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex">
            <Helmet>
                <title>디지털 스페셜 관리</title>
                <meta name="description" content="디지털 스페셜 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={814} className="mr-gutter" bodyClassName="d-flex flex-column" title="디지털 스페셜">
                <Suspense>
                    <SpecialList match={match} />
                </Suspense>
            </MokaCard>

            {/* 등록/수정 */}
            <Switch>
                <Route path={[`${match.path}/add`, `${match.path}/:seqNo`]}>
                    <SpecialEdit match={match} />
                </Route>
            </Switch>
        </div>
    );
};

export default Special;
