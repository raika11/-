import React from 'react';
import Search from './ContainerSearch';
import AgGrid from './ContainerAgGrid';

const ContainerList = ({ onDelete }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} />
        </>
    );
};

export default ContainerList;
