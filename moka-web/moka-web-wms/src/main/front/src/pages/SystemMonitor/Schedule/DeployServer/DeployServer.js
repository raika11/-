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
            <div className="mr-gutter d-flex flex-column" style={{ width: 892 }}>
                <h2 style={{ marginBottom: '20px' }}>삭제 작업 목록</h2>
                <Suspense>
                    <DeployServerList />
                </Suspense>
            </div>

            {/* 배포 서버 등록, 수정 */}
            <Switch>
                <Route path={[`${match.path}/deploy-server/add`, `${match.path}/deploy-server/:seqNo`]}>
                    <div className="d-flex flex-column" style={{ width: 688 }}>
                        <DeployServerEdit />
                    </div>
                </Route>
            </Switch>
        </div>
    );
};

export default DeployServer;
