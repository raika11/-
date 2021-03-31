import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import RunStateList from './RunStateList';
import RunStateSearchList from './RunStateSearchList';

/**
 * 스케줄 서버 관리 > 작업 실행상태
 */
const RunState = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <div className="h-100 d-flex">
            {/* 작업 실행 상태 현황 */}
            <div className="mr-gutter" style={{ width: 900 }}>
                <RunStateList show={show} />
            </div>

            {/* 작업 실행 상태 목록 */}
            <div className="flex-fill d-flex flex-column">
                <RunStateSearchList show={show} match={match} />
            </div>
        </div>
    );
};

export default RunState;
