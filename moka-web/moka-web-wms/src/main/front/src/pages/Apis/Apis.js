import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { MokaCard } from '@/components';
import ApisEdit from './ApisEdit';

const ApisList = React.lazy(() => import('./ApisList'));

/**
 * API 관리
 */
const Apis = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>API 관리</title>
                <meta name="description" content="API 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* API 목록 */}
            <MokaCard title="API 관리" width={812} className="mr-gutter" bodyClassName="d-flex flex-column">
                <Suspense>
                    <ApisList />
                </Suspense>
            </MokaCard>

            {/* API 정보 */}
            <Switch>
                <Route path={[`${match.path}/add`, `${match.path}/:seqNo`]}>
                    <ApisEdit match={match} />
                </Route>
            </Switch>
        </div>
    );
};

export default Apis;
