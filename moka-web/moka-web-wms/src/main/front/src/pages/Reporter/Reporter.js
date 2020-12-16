import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { MokaCard } from '@components';
import { GET_REPORTER, CHANGE_REPORTER } from '@store/reporter';

// relations
const ReporterList = React.lazy(() => import('./ReporterList'));
const ReporterEdit = React.lazy(() => import('./ReporterEdit'));

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
            <MokaCard title="기자 목록" width={830} className="mr-4 flex-fill" headerClassName="pb-0" bodyClassName="d-flex flex-column" titleClassName="mb-0">
                <Suspense>
                    <ReporterList />
                </Suspense>
            </MokaCard>

            {/* 기자 정보 */}

            <MokaCard title="기자 정보" width={730} headerClassName="pb-0" titleClassName="mb-0" loading={loading}>
                <Suspense>
                    <Switch>
                        <Route path={['/reporter', '/reporter/:repSeq']} exact render={() => <ReporterEdit />} />
                    </Switch>
                </Suspense>
            </MokaCard>
        </div>
    );
};

export default ReporterMgr;
