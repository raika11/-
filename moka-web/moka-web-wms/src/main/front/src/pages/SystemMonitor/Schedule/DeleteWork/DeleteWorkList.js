import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Search from './DeleteWorkSearch';
import AgGrid from './DeleteWorkAgGrid';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록
 */
const DeleteWorkList = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}/delete-work`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <>
            <Search show={show} />
            <AgGrid match={match} />
        </>
    );
};

export default DeleteWorkList;
