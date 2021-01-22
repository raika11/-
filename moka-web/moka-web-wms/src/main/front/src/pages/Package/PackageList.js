import React from 'react';
import Search from './PackageSearch';
import AgGrid from './PackageAgGrid';

/**
 * 패키지 목록
 */
const PackageList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default PackageList;
