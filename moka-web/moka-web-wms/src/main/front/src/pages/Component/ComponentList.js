import React from 'react';
import Search from './ComponentSearch';
import AgGrid from './ComponentAgGrid';

/**
 * 컴포넌트 관리 > 컴포넌트 목록
 */
const ComponentList = ({ match }) => {
    return (
        <>
            <Search />
            <AgGrid match={match} />
        </>
    );
};

export default ComponentList;
