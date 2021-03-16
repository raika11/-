import React, { Suspense } from 'react';

const RunStateList = React.lazy(() => import('./RunStateList'));
const RunStateSearchList = React.lazy(() => import('./RunStateSearchList'));

/**
 * 스케줄 서버 관리 > 작업 실행상태
 */
const RunState = ({ match }) => {
    return (
        <div className="h-100 d-flex">
            {/* 작업 실행 상태 현황 */}
            <div className="mr-gutter" style={{ width: 752 }}>
                <Suspense>
                    <RunStateList />
                </Suspense>
            </div>

            {/* 작업 실행 상태 목록 */}
            <div className="flex-fill d-flex flex-column">
                <Suspense>
                    <RunStateSearchList match={match} />
                </Suspense>
            </div>
        </div>
    );
};

export default RunState;
