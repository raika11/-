import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import AgGrid from './RunStateAgGrid';

/**
 * 스케줄 서버 관리 > 작업 실행상태 목록
 */
const RunStateList = ({ match, show }) => {
    const history = useHistory();

    useEffect(() => {
        if (show) {
            history.push(`${match.path}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return <AgGrid show={show} />;
};

export default RunStateList;
