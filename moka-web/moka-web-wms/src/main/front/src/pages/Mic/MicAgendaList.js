import React from 'react';
import Search from './MicAgendaSearch';
import AgGrid from './MicAgendaAgGrid';

/**
 * 시민 마이크 아젠다 목록
 */
const MicAgendaList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default MicAgendaList;
