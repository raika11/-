import React from 'react';
import Search from './ComponentSearch';
import AgGrid from './ComponentAgGrid';

const ComponentList = ({ onDelete }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} />
        </>
    );
};

export default ComponentList;
