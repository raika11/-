import React from 'react';
import Search from './ArticleSourceSearch';
import AgGrid from './ArticleSourceAgGrid';

/**
 * 수신 매체 목록
 */
const ArticleSourceList = () => {
    return (
        <>
            {/* 매체 검색 */}
            <Search />
            {/* 매체 목록 테이블 */}
            <AgGrid />
        </>
    );
};

export default ArticleSourceList;
