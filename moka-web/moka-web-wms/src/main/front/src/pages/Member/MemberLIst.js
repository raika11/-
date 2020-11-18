import React from 'react';
import AgGrid from './MemberAgGrid';
import Search from './MemberSearch';
const MemberLIst = (props) => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default MemberLIst;
