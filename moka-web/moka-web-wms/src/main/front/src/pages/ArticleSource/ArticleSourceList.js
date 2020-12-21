import React from 'react';
import ArticleSourceAgGrid from './ArticleSourceAgGrid';
import ArticleSourceSearch from './ArticleSourceSearch';

const ArticleSourceList = () => {
    return (
        <>
            {/* 매체 검색 */}
            <ArticleSourceSearch />

            {/* 매체 목록 테이블 */}
            <ArticleSourceAgGrid />
        </>
    );
};

export default ArticleSourceList;
