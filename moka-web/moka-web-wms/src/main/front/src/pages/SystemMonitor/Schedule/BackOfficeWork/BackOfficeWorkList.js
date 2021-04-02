import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Search from './BackOfficeWorkSearch';
import AgGrid from './BackOfficeWorkAgGrid';

/**
 * 스케줄 서버 관리 > 백오피스 예약작업 목록
 */
const BackOfficeWorkList = ({ show, match }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}/back-office-work`);
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

export default BackOfficeWorkList;
