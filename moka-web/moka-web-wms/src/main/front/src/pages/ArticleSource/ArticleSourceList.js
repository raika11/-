import React from 'react';
import Search from './ArticleSourceSearch';
import AgGrid from './ArticleSourceAgGrid';

/**
 * 수신 매체 목록
 */
const ArticleSourceList = () => {
    return (
        <div className="d-flex flex-column">
            {/* 매체 검색 */}
            <Search />

            {/* 매체 목록 테이블 */}
            <AgGrid />
        </div>
    );
};

export default ArticleSourceList;
