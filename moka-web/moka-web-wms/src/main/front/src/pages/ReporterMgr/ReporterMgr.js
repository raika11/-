import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { MokaCard } from '@components';
import { GET_REPORTER, CHANGE_REPORTER } from '@store/reporter';

// relations
const ReporterMgrList = React.lazy(() => import('./ReporterMgrList'));
const ReporterMgrEdit = React.lazy(() => import('./ReporterMgrEdit'));

const ReporterMgr = () => {
    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_REPORTER] || store.loading[CHANGE_REPORTER],
    }));

    return (
        <div className="d-flex">
            <Helmet>
                <title>기자관리</title>
                <meta name="description" content="기자관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 기자 목록 */}
            <MokaCard title="기자 목록" width={830} className="mr-4" headerClassName="pb-0" titleClassName="mb-0">
                <Suspense>
                    <ReporterMgrList />
                </Suspense>
            </MokaCard>

            {/* 기자 정보 */}
            <Switch>
                <Route
                    path={['/reporterMgr', '/reporterMgr/:repSeq']}
                    exact
                    render={() => (
                        <MokaCard title="기자 정보" width={730} headerClassName="pb-0" titleClassName="mb-0">
                            <Suspense>
                                <ReporterMgrEdit />
                            </Suspense>
                        </MokaCard>
                    )}
                />
            </Switch>
        </div>
    );
};

export default ReporterMgr;
