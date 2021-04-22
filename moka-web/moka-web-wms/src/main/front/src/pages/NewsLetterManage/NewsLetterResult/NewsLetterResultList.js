import React from 'react';
import Search from './NewsLetterResultSearch';
import AgGrid from './NewsLetterResultAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 목록
 */
const NewsLetterResultList = ({ match }) => {
    return (
        <>
            <Search match={match} />
            <AgGrid match={match} />
        </>
    );
};

export default NewsLetterResultList;
