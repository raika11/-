import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import WorkEdit from './WorkEdit';

const WorkList = React.lazy(() => import('./WorkList'));

/**
 * 스케줄 서버 관리 > 작업 목록
 */
const Work = (props) => {
    const { match } = props;

    return (
        <div className="h-100 d-flex">
            {/* 작업 목록 */}
            <div className="mr-gutter d-flex flex-column" style={{ width: 892, padding: '20px 24px' }}>
                <h2 style={{ marginBottom: '20px' }}>작업 목록</h2>
                <Suspense>
                    <WorkList />
                </Suspense>
            </div>

            {/* 작업 등록, 수정 */}
            <Switch>
                <Route path={[`${match.path}/work-list/add`, `${match.path}/work-list/:seqNo`]}>
                    <div className="d-flex flex-column" style={{ width: 688, padding: '20px 24px' }}>
                        <WorkEdit />
                    </div>
                </Route>
            </Switch>
        </div>
    );
};

export default Work;
