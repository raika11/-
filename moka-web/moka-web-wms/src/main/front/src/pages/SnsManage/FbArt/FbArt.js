import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaLoader } from '@components';

import FbArtEdit from './FbArtEdit';
const FbArtList = React.lazy(() => import('./FbArtList'));

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
            <MokaCard width={1030} className="mr-gutter" titleClassName="mb-0" header={false} bodyClassName="d-flex flex-column">
                <Suspense fallback={<MokaLoader />}>
                    <FbArtList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route path={[`${match.url}/:totalId`]} exact render={(props) => <FbArtEdit {...props} />} />
        </div>
    );
};

export default FbArt;
