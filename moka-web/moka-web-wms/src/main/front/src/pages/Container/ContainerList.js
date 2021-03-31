import React from 'react';
import Search from './ContainerSearch';
import AgGrid from './ContainerAgGrid';

/**
 * 컨테이너 관리 > 컨테이너 목록
 */
const ContainerList = ({ onDelete, match }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} match={match} />
        </>
    );
};

export default ContainerList;
