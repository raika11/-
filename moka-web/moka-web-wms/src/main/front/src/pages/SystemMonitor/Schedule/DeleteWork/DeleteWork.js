import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import DeleteWorkList from './DeleteWorkList';
import DeleteWorkEdit from './DeleteWorkEdit';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록
 */
const DeleteWork = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <div className="h-100 d-flex">
            {/* 삭제 작업 목록 */}
            <div className="mr-gutter" style={{ width: 825 }}>
                <DeleteWorkList show={show} match={match} />
            </div>

            {/* 삭제 작업 조회 */}
            <Route path={[`${match.path}/work-delete/:jobSeq`]}>
                <div className="flex-fill">
                    <DeleteWorkEdit match={match} />
                </div>
            </Route>
        </div>
    );
};

export default DeleteWork;
