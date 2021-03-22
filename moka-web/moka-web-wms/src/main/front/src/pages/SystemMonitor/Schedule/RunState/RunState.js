import React from 'react';
import RunStateList from './RunStateList';
import RunStateSearchList from './RunStateSearchList';

/**
 * 스케줄 서버 관리 > 작업 실행상태
 */
const RunState = ({ match }) => {
    return (
        <div className="h-100 d-flex">
            {/* 작업 실행 상태 현황 */}
            <div className="mr-gutter" style={{ width: 900 }}>
                <RunStateList />
            </div>

            {/* 작업 실행 상태 목록 */}
            <div className="flex-fill d-flex flex-column">
                <RunStateSearchList match={match} />
            </div>
        </div>
    );
};

export default RunState;
