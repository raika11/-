import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Search from './WorkSearch';
import AgGrid from './WorkAgGrid';

/**
 * 스케줄 서버 관리 > 작업 목록
 */
const WorkList = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}/work-list`);
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

export default WorkList;
