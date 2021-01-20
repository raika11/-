import React, { Suspense } from 'react';

const ScheduleList = React.lazy(() => import('./ScheduleList'));
const RunStateSearchList = React.lazy(() => import('./RunStateSearchList'));

const ScheduleWorkState = () => {
    return (
        <div className="h-100 d-flex">
            {/* 작업 실행 상태 현황 */}
            <div className="mr-gutter d-flex flex-column" style={{ width: 752, padding: '20px 24px' }}>
                <h2 style={{ marginBottom: '20px' }}>작업 실행 상태 현황</h2>
                <Suspense>
                    <ScheduleList />
                </Suspense>
            </div>

            {/* 스케줄 서버 모니터링 목록 */}
            <div className="d-flex flex-column" style={{ width: 828, padding: '20px 24px' }}>
                <h2 style={{ marginBottom: '20px' }}>작업 실행 상태 목록</h2>
                <Suspense>
                    <RunStateSearchList />
                </Suspense>
            </div>
        </div>
    );
};

export default ScheduleWorkState;
