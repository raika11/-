import React from 'react';
import Search from './ComponentSearch';
import AgGrid from './ComponentAgGrid';

const ComponentList = ({ onDelete, match }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} match={match} />
        </>
    );
};

export default ComponentList;
