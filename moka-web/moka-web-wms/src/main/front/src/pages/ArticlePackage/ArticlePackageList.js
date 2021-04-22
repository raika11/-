import React from 'react';
import Search from './ArticlePackageSearch';
import AgGrid from './ArticlePackageAgGrid';

/**
 * 패키지 관리 > 기사 패키지 > 기사 패키지 목록
 */
const ArticlePackageList = ({ match }) => {
    return (
        <>
            <Search match={match} />
            <AgGrid match={match} />
        </>
    );
};

export default ArticlePackageList;
