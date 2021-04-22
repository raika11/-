import React from 'react';
import Search from './NewsLetterSendSearch';
import AgGrid from './NewsLetterSendAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 관리 목록
 */
const NewsLetterSendList = ({ match }) => {
    return (
        <>
            <Search match={match} />
            <AgGrid match={match} />
        </>
    );
};

export default NewsLetterSendList;
