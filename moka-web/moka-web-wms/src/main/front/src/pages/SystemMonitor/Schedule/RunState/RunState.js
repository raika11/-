import React, { Suspense } from 'react';

const RunStateList = React.lazy(() => import('./RunStateList'));
const RunStateSearchList = React.lazy(() => import('./RunStateSearchList'));

/**
 * 스케줄 서버 관리 > 작업 실행상태
 */
const RunState = () => {
    return (
        <div className="h-100 d-flex">
            {/* 작업 실행 상태 현황 */}
            <div className="mr-gutter d-flex flex-column" style={{ width: 752 }}>
                <h2 style={{ marginBottom: '20px' }}>작업 실행상태 현황</h2>
                <Suspense>
                    <RunStateList />
                </Suspense>
            </div>

            {/* 작업 실행 상태 목록 */}
            <div className="d-flex flex-column" style={{ width: 828 }}>
                <h2 style={{ marginBottom: '20px' }}>작업 실행상태 목록</h2>
                <Suspense>
                    <RunStateSearchList />
                </Suspense>
            </div>
        </div>
    );
};

export default RunState;
