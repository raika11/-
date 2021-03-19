import React from 'react';
import AgGrid from './MemberAgGrid';
import Search from './MemberSearch';

const MemberLIst = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default MemberLIst;
