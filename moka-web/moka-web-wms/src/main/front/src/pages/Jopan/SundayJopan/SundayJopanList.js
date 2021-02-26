import React from 'react';
import Search from './SundayJopanSearch';
import AgGrid from './SundayJopanAgGrid';

/**
 * 수신기사 > 중앙선데이 조판 리스트
 */
const SundayJopanList = ({ match, setView }) => {
    return (
        <>
            <Search />
            <AgGrid match={match} setView={setView} />
        </>
    );
};

export default SundayJopanList;
