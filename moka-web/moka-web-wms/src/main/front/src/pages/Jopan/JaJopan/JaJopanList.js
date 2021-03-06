import React from 'react';
import Search from './JaJopanSearch';
import AgGrid from './JaJopanAgGrid';

/**
 * 수신기사 > 중앙일보 조판 리스트
 */
const JaJopanList = ({ match, setView }) => {
    return (
        <>
            <Search />
            <AgGrid match={match} setView={setView} />
        </>
    );
};

export default JaJopanList;
