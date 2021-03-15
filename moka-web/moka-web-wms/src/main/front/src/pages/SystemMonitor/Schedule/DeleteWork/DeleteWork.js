import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import DeleteWorkEdit from './DeleteWorkEdit';

const DeleteWorkList = React.lazy(() => import('./DeleteWorkList'));

/**
 * 스케줄 서버 관리 > 삭제 작업 목록
 */
const DeleteWork = (props) => {
    const { match } = props;

    return (
        <div className="h-100 d-flex">
            {/* 삭제 작업 목록 */}
            <div className="mr-gutter" style={{ width: 825 }}>
                <Suspense>
                    <DeleteWorkList match={match} />
                </Suspense>
            </div>

            {/* 삭제 작업 조회 */}
            <Route path={[`${match.path}/work-delete/:jobSeq`]}>
                <div className="flex-fill">
                    <Suspense>
                        <DeleteWorkEdit match={match} />
                    </Suspense>
                </div>
            </Route>
        </div>
    );
};

export default DeleteWork;
