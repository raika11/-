import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MokaCard } from '@/components';
import { clearStore } from '@store/internalApi';
import InternalApiEdit from './InternalApiEdit';
import InternalApiList from './InternalApiList';

/**
 * API 관리
 */
const InternalApi = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>API 관리</title>
                <meta name="description" content="API 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* API 목록 */}
            <MokaCard title="API 관리" width={812} className="mr-gutter" bodyClassName="d-flex flex-column">
                <InternalApiList match={match} />
            </MokaCard>

            {/* API 정보 */}
            <Switch>
                <Route path={[`${match.path}/add`, `${match.path}/:seqNo`]}>
                    <InternalApiEdit match={match} />
                </Route>
            </Switch>
        </div>
    );
};

export default InternalApi;
