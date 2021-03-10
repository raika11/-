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
            <div className="mr-gutter d-flex flex-column" style={{ width: 892 }}>
                <h2 style={{ marginBottom: '20px' }}>작업 목록</h2>
                <Suspense>
                    <WorkList match={match} />
                </Suspense>
            </div>

            {/* 작업 등록, 수정 */}
            <Switch>
                <Route path={[`${match.path}/work-list/add`, `${match.path}/work-list/:jobSeq`]}>
                    <div className="flex-fill">
                        <WorkEdit match={match} />
                    </div>
                </Route>
            </Switch>
        </div>
    );
};

export default Work;
