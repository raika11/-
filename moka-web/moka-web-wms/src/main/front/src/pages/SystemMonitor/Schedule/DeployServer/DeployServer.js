import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import DeployServerEdit from './DeployServerEdit';

const DeployServerList = React.lazy(() => import('./DeployServerList'));

/**
 * 스케줄 서버 관리 > 배포 서버 관리
 */
const DeployServer = (props) => {
    const { match } = props;

    return (
        <div className="h-100 d-flex">
            {/* 배포 서버 목록 */}
            <div className="mr-gutter" style={{ width: 892 }}>
                <Suspense>
                    <DeployServerList match={match} />
                </Suspense>
            </div>

            {/* 배포 서버 등록, 수정 */}
            <Switch>
                <Route path={[`${match.path}/deploy-server/add`, `${match.path}/deploy-server/:serverSeq`]}>
                    <div className="flex-fill">
                        <DeployServerEdit match={match} />
                    </div>
                </Route>
            </Switch>
        </div>
    );
};

export default DeployServer;
