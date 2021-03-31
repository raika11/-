import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import BackOfficeWorkEdit from './BackOfficeWorkEdit';
import BackOfficeWorkList from './BackOfficeWorkList';

/**
 * 스케줄 서버 관리 > 백오피스 예약작업
 */
const BackOfficeWork = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <div className="h-100 d-flex">
            {/* 백오피스 예약작업 목록 */}
            <div className="mr-gutter" style={{ width: 825 }}>
                <BackOfficeWorkList show={show} match={match} />
            </div>

            {/* 작업정보 */}
            <Route path={[`${match.path}/back-office-work/:seqNo`]}>
                <div className="flex-fill">
                    <BackOfficeWorkEdit match={match} />
                </div>
            </Route>
        </div>
    );
};

export default BackOfficeWork;
