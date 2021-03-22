import React from 'react';
import { Route } from 'react-router-dom';
import DeleteWorkList from './DeleteWorkList';
import DeleteWorkEdit from './DeleteWorkEdit';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록
 */
const DeleteWork = (props) => {
    const { match } = props;

    return (
        <div className="h-100 d-flex">
            {/* 삭제 작업 목록 */}
            <div className="mr-gutter" style={{ width: 825 }}>
                <DeleteWorkList match={match} />
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
