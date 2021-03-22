import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WorkList from './WorkList';
import WorkEdit from './WorkEdit';

/**
 * 스케줄 서버 관리 > 작업 목록
 */
const Work = (props) => {
    const { match } = props;

    return (
        <div className="h-100 d-flex">
            {/* 작업 목록 */}
            <div className="mr-gutter" style={{ width: 892 }}>
                <WorkList match={match} />
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
