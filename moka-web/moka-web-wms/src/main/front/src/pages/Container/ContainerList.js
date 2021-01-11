import React from 'react';
import Search from './ContainerSearch';
import AgGrid from './ContainerAgGrid';

const ContainerList = ({ onDelete, match }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} match={match} />
        </>
    );
};

export default ContainerList;
