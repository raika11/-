import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import DeployServerList from './DeployServerList';
import DeployServerEdit from './DeployServerEdit';

/**
 * 스케줄 서버 관리 > 배포 서버 관리
 */
const DeployServer = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <div className="h-100 d-flex">
            {/* 배포 서버 목록 */}
            <div className="mr-gutter" style={{ width: 892 }}>
                <DeployServerList show={show} match={match} />
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
