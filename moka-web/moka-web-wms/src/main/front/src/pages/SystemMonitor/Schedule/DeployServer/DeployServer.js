import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DeployServerList from './DeployServerList';
import DeployServerEdit from './DeployServerEdit';

/**
 * 스케줄 서버 관리 > 배포 서버 관리
 */
const DeployServer = (props) => {
    const { match } = props;

    return (
        <div className="h-100 d-flex">
            {/* 배포 서버 목록 */}
            <div className="mr-gutter" style={{ width: 892 }}>
                <DeployServerList match={match} />
            </div>

            {/* 배포 서버 등록, 수정 */}
            <Switch>
                <Route path={[`${match.path}/deploy-server/add`, `${match.path}/deploy-server/:serverSeq`]}>
                    <DeployServerEdit match={match} />
                </Route>
            </Switch>
        </div>
    );
};

export default DeployServer;
