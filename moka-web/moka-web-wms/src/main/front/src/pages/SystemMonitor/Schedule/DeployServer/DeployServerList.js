import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Search from './DeployServerSearch';
import AgGrid from './DeployServerAgGrid';

/**
 * 스케줄 서버 관리 > 배포 서버 관리 목록
 */
const DeployServerList = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}/deploy-server`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <>
            <Search show={show} match={match} />
            <AgGrid match={match} />
        </>
    );
};

export default DeployServerList;
