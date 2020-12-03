import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';

const FbArtList = React.lazy(() => import('./FbArtList'));
const FbArtEdit = React.lazy(() => import('./FbArtEdit'));

/**
 * FB전송기사
 */
const FbArt = ({ match }) => {
    // FIXME 클린 함수 생성.

    return (
        <div className="d-flex">
            <Helmet>
                <title>FB전송기사</title>
                <meta name="description" content="FB전송기사 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={840} className="mr-gutter flex-fill" titleClassName="mb-0" header={false}>
                <Suspense>
                    <FbArtList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[match.url, `${match.url}/:mataSeq`]}
                exact
                render={(props) => (
                    <Suspense>
                        <FbArtEdit {...props} />
                    </Suspense>
                )}
            />
        </div>
    );
};

export default FbArt;
