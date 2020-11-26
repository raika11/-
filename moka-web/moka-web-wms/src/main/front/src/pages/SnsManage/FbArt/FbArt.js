import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';

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
                <Suspense>리스트</Suspense>
            </MokaCard>
        </div>
    );
};

export default FbArt;
