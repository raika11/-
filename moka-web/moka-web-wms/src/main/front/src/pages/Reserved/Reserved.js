import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { MokaCard } from '@components';

const ReservedList = React.lazy(() => import('./ReservedList'));
const ReservedEdit = React.lazy(() => import('./ReservedEdit'));

/**
 * 예약어 관리 컴포넌트
 */
const Reserved = () => {
    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>예약어관리</title>
                    <meta name="description" content="예약어관리페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 예약어 검색 */}
                <MokaCard width={412} className="mr-10" titleClassName="mb-0" title="예약어 검색">
                    <Suspense>
                        <ReservedList />
                    </Suspense>
                </MokaCard>

                {/* 예약어 정보 */}

                <Route
                    path={['/reserved', '/reserved/:reservedSeq']}
                    exact
                    render={() => (
                        <MokaCard width={780} titleClassName="mb-0" title="예약어 정보">
                            <Suspense>
                                <ReservedEdit />
                            </Suspense>
                        </MokaCard>
                    )}
                />
            </div>
        </>
    );
};

export default Reserved;
