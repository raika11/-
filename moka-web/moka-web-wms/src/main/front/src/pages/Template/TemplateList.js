import React from 'react';
import Search from './TemplateSearch';
import AgGrid from './TemplateAgGrid';

const TemplateList = ({ onDelete, match }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} match={match} />
        </>
    );
};

export default TemplateList;
