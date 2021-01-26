import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { MokaCard } from '@components';
import EditLogInfo from './EditLogInfo';
const EditLogList = React.lazy(() => import('./EditLogList'));

/**
 * 시스템관리 > 로그관리
 */
const EditLog = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>로그 관리</title>
                <meta name="description" content="로그 관리페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Suspense>
                <MokaCard width={700} className="mr-gutter" bodyClassName="d-flex flex-column" title="로그 관리">
                    <EditLogList match={match} />
                </MokaCard>
            </Suspense>

            <Route path={[`${match.url}/:seqNo`]} exact render={() => <EditLogInfo match={match} />} />
        </div>
    );
};

export default EditLog;
