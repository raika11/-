import React from 'react';
import Search from './NewsLetterSearch';
import AgGrid from './NewsLetterAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 관리
 */
const NewsLetterList = ({ match }) => {
    return (
        <>
            <Search />
            <AgGrid match={match} />
        </>
    );
};

export default NewsLetterList;
