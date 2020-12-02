import React, { useEffect, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';

const SnsMataList = React.lazy(() => import('./SnsMataList'));
const SnsMataEdit = React.lazy(() => import('./SnsMataEdit'));

/**
 * FB & TW
 */
const SnsMata = ({ match }) => {
    // FIXME 클린 함수 생성.

    return (
        <div className="d-flex">
            <Helmet>
                <title>FB & TW</title>
                <meta name="description" content="FB & TW 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={450} className="mr-gutter flex-fill" titleClassName="mb-0" header={false}>
                <Suspense>
                    <SnsMataList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[match.url, `${match.url}/:mataSeq`]}
                exact
                render={(props) => (
                    <Suspense>
                        <SnsMataEdit {...props} />
                    </Suspense>
                )}
            />
        </div>
    );
};

export default SnsMata;
