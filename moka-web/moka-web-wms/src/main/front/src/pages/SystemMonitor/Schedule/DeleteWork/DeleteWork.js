import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
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
            <div className="mr-gutter d-flex flex-column" style={{ width: 892 }}>
                <h2 style={{ marginBottom: '20px' }}>삭제 작업 목록</h2>
                <Suspense>
                    <DeleteWorkList />
                </Suspense>
            </div>

            {/* 삭제 작업 조회 */}
            <Switch>
                <Route path={[`${match.path}/work-delete/:seqNo`]}>
                    <div className="d-flex flex-column" style={{ width: 688 }}>
                        <h2 style={{ marginBottom: '20px' }}>삭제 작업 조회</h2>
                        <Suspense>
                            <DeleteWorkEdit />
                        </Suspense>
                    </div>
                </Route>
            </Switch>
        </div>
    );
};

export default DeleteWork;
