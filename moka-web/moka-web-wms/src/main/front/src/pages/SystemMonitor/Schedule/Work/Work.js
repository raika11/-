import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import WorkList from './WorkList';
import WorkEdit from './WorkEdit';

/**
 * 스케줄 서버 관리 > 작업 목록
 */
const Work = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <div className="h-100 d-flex">
            {/* 작업 목록 */}
            <div className="mr-gutter" style={{ width: 892 }}>
                <WorkList show={show} match={match} />
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
