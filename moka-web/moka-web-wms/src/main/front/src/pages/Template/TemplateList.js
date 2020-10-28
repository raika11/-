import React from 'react';
import Search from './TemplateSearch';
import AgGrid from './TemplateAgGrid';

const TemplateList = ({ onDelete }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} />
        </>
    );
};

export default TemplateList;
