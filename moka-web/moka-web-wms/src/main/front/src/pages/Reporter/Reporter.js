import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { MokaCard } from '@components';
import { GET_REPORTER, CHANGE_REPORTER } from '@store/reporter';

import ReporterEdit from './ReporterEdit';
const ReporterList = React.lazy(() => import('./ReporterList'));

const Reporter = ({ match }) => {
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
            <MokaCard title="기자 목록" width={830} className="mr-4" bodyClassName="d-flex flex-column">
                <Suspense>
                    <ReporterList match={match} />
                </Suspense>
            </MokaCard>

            {/* 기자 정보 */}
            <Route
                path={[`${match.path}/:repSeq`]}
                exact
                render={(props) => (
                    <MokaCard title="기자 정보" width={730} loading={loading}>
                        <ReporterEdit match={match} />
                    </MokaCard>
                )}
            />
        </div>
    );
};

export default Reporter;
